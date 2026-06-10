import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiDelete, apiFetch, checkApiHealth, type ApiError } from '../api/client.js';
import type { ConfirmState } from '../components/ConfirmDialog.js';
import { apiMessages, t } from '../i18n/ru.js';
import { deriveFlowStep } from '../utils/deriveFlowStep.js';
import type {
  Card,
  CardUiState,
  ConceptSet,
  ContentBlock,
  IconSetStyleOption,
  IconStatusEntry,
  RegistryIcon,
  SessionPageEntry,
  SessionState,
  SessionSummary,
  StructureAuditSummary,
} from '../types.js';
import { buildCardUiForCard, iconStatusFromState } from '../utils/hydrateCardUi.js';

const ACTIVE_SESSION_KEY = 'synaptik.activeSessionId';
const ICON_SET_STYLE_KEY = 'synaptik.iconSetStyleId';
const DEFAULT_ICON_SET_STYLE = 'isometric';

export function useSynaptikSession() {
  const [url, setUrl] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [flowStep, setFlowStep] = useState(1);
  const [dna, setDna] = useState<Record<string, unknown> | null>(null);
  const [iconStyleBlock, setIconStyleBlock] = useState<string | undefined>();
  const [iconSetStyleId, setIconSetStyleId] = useState(() => {
    try {
      return localStorage.getItem(ICON_SET_STYLE_KEY) ?? DEFAULT_ICON_SET_STYLE;
    } catch {
      return DEFAULT_ICON_SET_STYLE;
    }
  });
  const [iconSetStyleLabel, setIconSetStyleLabel] = useState<string | undefined>();
  const [styleOptions, setStyleOptions] = useState<IconSetStyleOption[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[] | undefined>();
  const [pages, setPages] = useState<SessionPageEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [extendPageUrls, setExtendPageUrls] = useState<string[]>(['']);
  const [appliedIconSetStyleId, setAppliedIconSetStyleId] = useState('');
  const styleApplyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [conceptSets, setConceptSets] = useState<Record<string, ConceptSet>>({});
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [cardUi, setCardUi] = useState<Record<string, CardUiState>>({});
  const [iconStatus, setIconStatus] = useState<Record<string, IconStatusEntry>>({});
  const [sessionList, setSessionList] = useState<SessionSummary[]>([]);
  const [registry, setRegistry] = useState<RegistryIcon[]>([]);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumed, setResumed] = useState(false);
  const [sessionsError, setSessionsError] = useState('');
  const [apiHealthMessage, setApiHealthMessage] = useState('');
  const [apiHealthOk, setApiHealthOk] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [structureAudit, setStructureAudit] = useState<StructureAuditSummary | undefined>();
  const cardsRef = useRef<HTMLDivElement>(null);
  const bootstrapped = useRef(false);

  const applyFlowStep = useCallback(
    (sid: string, cardList: Card[], ui: Record<string, CardUiState>) => {
      setFlowStep(deriveFlowStep(sid, cardList, ui));
    },
    [],
  );

  const persistActiveSession = (sid: string) => {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, sid);
    } catch {
      // ignore
    }
  };

  const loadRegistry = useCallback(async () => {
    try {
      const data = await apiFetch<{ icons?: RegistryIcon[] }>('/registry');
      setRegistry(data.icons ?? []);
    } catch {
      setRegistry([]);
    }
  }, []);

  const refreshSessionList = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const health = await checkApiHealth();
      setApiHealthOk(health.ok);
      setApiHealthMessage(health.ok ? t.apiHealthOk : (health.message ?? t.sessionsApiOutdated));
      if (!health.ok) {
        setSessionList([]);
        setSessionsError('');
        return;
      }
      const data = await apiFetch<{ sessions: SessionSummary[] }>('/sessions');
      setSessionList(data.sessions ?? []);
      setSessionsError('');
    } catch (e) {
      setSessionList([]);
      const err = e as ApiError;
      if (err.isNotJson || err.status === 404) {
        setSessionsError('');
        setApiHealthOk(false);
        setApiHealthMessage(t.sessionsApiOutdated);
      } else if (err.status && err.status >= 500) {
        setSessionsError('');
        setApiHealthOk(false);
        setApiHealthMessage(t.apiServerError(err.status));
      } else {
        setSessionsError(t.sessionsLoadFailed(err.message ?? String(e)));
      }
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const hydrateFromState = useCallback(
    async (state: SessionState, options?: { silent?: boolean }) => {
      setSessionId(state.sessionId);
      persistActiveSession(state.sessionId);
      if (state.sourceUrl) setUrl(state.sourceUrl);
      setDna(state.dna);
      setIconStyleBlock(state.iconStyleBlock);
      if (state.iconSetStyleId) {
        setIconSetStyleId(state.iconSetStyleId);
        setAppliedIconSetStyleId(state.iconSetStyleId);
        try {
          localStorage.setItem(ICON_SET_STYLE_KEY, state.iconSetStyleId);
        } catch {
          // ignore
        }
      } else {
        setAppliedIconSetStyleId('');
      }
      setIconSetStyleLabel(state.iconSetStyleLabel);
      if (typeof state.dna?.projectSlug === 'string') setProjectSlug(state.dna.projectSlug);
      setCards(state.cards);
      setBlocks(state.blocks);
      setStructureAudit(state.structureAudit);
      setPages(state.pages ?? []);
      if (state.sourceUrl) {
        setExtendPageUrls((prev) => {
          const hasValue = prev.some((u) => u.trim());
          return hasValue ? prev : [state.sourceUrl ?? ''];
        });
      }

      const selMap: Record<string, string> = {};
      for (const s of state.selections) {
        selMap[s.cardId] = s.conceptId;
      }
      setSelections(selMap);

      setIconStatus(iconStatusFromState(state));

      const sets: Record<string, ConceptSet> = {};
      const ui: Record<string, CardUiState> = {};
      const publishedSet = new Set(state.publishedCardIds);

      for (const card of state.cards) {
        ui[card.id] = buildCardUiForCard(card, state, publishedSet);
        if (state.conceptCardIds.includes(card.id)) {
          try {
            const c = await apiFetch<ConceptSet>(
              `/session/${state.sessionId}/concepts/${card.id}`,
            );
            sets[card.id] = c;
          } catch {
            // skip
          }
        }
      }

      setConceptSets(sets);
      setCardUi(ui);
      applyFlowStep(state.sessionId, state.cards, ui);
      setResumed(true);
      if (!options?.silent) {
        setSuccess(t.successRestored(state.sessionId));
      }
    },
    [applyFlowStep],
  );

  const loadSessionState = useCallback(
    async (sid: string) => {
      const state = await apiFetch<SessionState>(`/session/${sid}/state`);
      await hydrateFromState(state, { silent: true });
    },
    [hydrateFromState],
  );

  const resumeSession = useCallback(
    async (sid: string) => {
      setBusy(true);
      setBusyLabel(t.busyLoadingSession);
      setError('');
      setResumed(false);
      try {
        const state = await apiFetch<SessionState>(`/session/${sid}/state`);
        await hydrateFromState(state);
        await refreshSessionList();
      } catch (e) {
        setError(
          e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
        );
      } finally {
        setBusy(false);
        setBusyLabel('');
      }
    },
    [hydrateFromState, refreshSessionList],
  );

  useEffect(() => {
    void loadRegistry();
    void refreshSessionList();
    void (async () => {
      try {
        const data = await apiFetch<{ styles: IconSetStyleOption[] }>('/icon-set-styles');
        setStyleOptions(data.styles ?? []);
      } catch {
        setStyleOptions([]);
      }
    })();
  }, [loadRegistry, refreshSessionList]);

  const persistIconSetStyle = useCallback((id: string) => {
    setIconSetStyleId(id);
    try {
      localStorage.setItem(ICON_SET_STYLE_KEY, id);
    } catch {
      // ignore
    }
    const label = styleOptions.find((o) => o.id === id)?.labelRu;
    if (label) setIconSetStyleLabel(label);
  }, [styleOptions]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!saved) return;
    void (async () => {
      try {
        const state = await apiFetch<SessionState>(`/session/${saved}/state`);
        await hydrateFromState(state, { silent: true });
        setSuccess(t.successBootRestored(saved));
      } catch {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    })();
  }, [hydrateFromState]);

  const executeRunStart = useCallback(
    async (forceNew: boolean) => {
      if (!apiHealthOk) {
        setError(t.analysisBlockedApi);
        return;
      }
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        setError(t.urlRequired);
        return;
      }
      if (!iconSetStyleId.trim()) {
        setError(t.iconSetStyleRequired);
        return;
      }
      setBusy(true);
      setBusyLabel(t.busyAnalyzing);
      setError('');
      setSuccess('');
      setSelections({});
      setCardUi({});
      setResumed(false);
      setFlowStep(1);
      try {
        const data = await apiFetch<{ sessionId?: string; projectSlug?: string }>('/run', {
          url: trimmedUrl,
          forceNew,
          iconSetStyleId,
        });
        const sid = data.sessionId ?? '';
        setSessionId(sid);
        persistActiveSession(sid);
        if (typeof data.projectSlug === 'string') setProjectSlug(data.projectSlug);
        const state = await apiFetch<SessionState>(`/session/${sid}/state`);
        await hydrateFromState(state, { silent: true });
        setSuccess(t.successAnalyzeDone);
        await refreshSessionList();
        setTimeout(() => cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      } catch (e) {
        const err = e as ApiError;
        if (err.status === 409 && err.existingSessionId) {
          setConfirm({ kind: 'sessionExists', sessionId: err.existingSessionId });
        } else {
          setError(t.formatApiError(err.message ?? String(e)));
          setFlowStep(1);
        }
      } finally {
        setBusy(false);
        setBusyLabel('');
      }
    },
    [apiHealthOk, hydrateFromState, iconSetStyleId, refreshSessionList, url],
  );

  const runStart = useCallback(
    (forceNew = false) => {
      if (forceNew) {
        setConfirm({ kind: 'forceNew' });
        return;
      }
      void executeRunStart(false);
    },
    [executeRunStart],
  );

  const previewRender = useCallback(
    async (cardId: string, force = false) => {
      if (!sessionId) return;
      const concept = selections[cardId];
      if (!concept) {
        setError(t.errorPickConcept);
        return;
      }
      setBusy(true);
      setBusyLabel(t.busyGenerating(cardId));
      setError('');
      try {
        await apiFetch('/select-concept', { sessionId, cardId, concept });
        const data = await apiFetch<{
          previewDataUrl?: string;
          previewUrl?: string;
          failedQa?: boolean;
          qualityWarnings?: string[];
        }>('/render-preview', {
          sessionId,
          cardId,
          force,
          regenerateNonce: Date.now(),
        });
        const cacheBust = Date.now();
        const previewSrc = data.previewDataUrl?.startsWith('data:')
          ? data.previewDataUrl
          : `${data.previewUrl}?t=${cacheBust}`;
        const prevUi = cardUi[cardId];
        const wasInCatalog =
          prevUi?.phase === 'published' ||
          Boolean(prevUi?.needsRepublish) ||
          iconStatus[cardId]?.catalogStatus === 'current' ||
          iconStatus[cardId]?.catalogStatus === 'outdated';

        const publishedUrl = iconStatus[cardId]?.publishedUrl;
        const publishedSrc =
          prevUi?.publishedSrc ??
          (publishedUrl ? `${publishedUrl}?t=${Date.now()}` : undefined);

        setCardUi((u) => {
          const prev = u[cardId];
          const next = {
            ...u,
            [cardId]: {
              phase: 'rendered' as const,
              previewSrc,
              renderedConceptId: concept,
              previewStale: false,
              publishedSrc: prev?.publishedSrc ?? publishedSrc,
              failedQa: data.failedQa,
              qualityWarnings: data.qualityWarnings,
              needsRepublish: wasInCatalog,
              catalogStatus: wasInCatalog ? ('outdated' as const) : ('none' as const),
            },
          };
          applyFlowStep(sessionId, cards, next);
          return next;
        });
        setSuccess(t.successPreviewDone);
        await refreshSessionList();
        if (sessionId) {
          try {
            const fresh = await apiFetch<SessionState>(`/session/${sessionId}/state`);
            setIconStatus(iconStatusFromState(fresh));
          } catch {
            // ignore
          }
        }
      } catch (e) {
        const err = e as Error & { status?: number; errorCode?: string };
        if (err.status === 422 || err.errorCode === 'PROMPT_QUALITY_LOW') {
          setError(t.errorPromptQuality);
          setConfirm({
            kind: 'promptQualityLow',
            cardId,
          });
        } else {
          setError(
            e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
          );
        }
      } finally {
        setBusy(false);
        setBusyLabel('');
      }
    },
    [applyFlowStep, cardUi, cards, iconStatus, refreshSessionList, selections, sessionId],
  );

  const executePublish = useCallback(
    async (cardId: string) => {
      if (!sessionId) return;
      const st = cardUi[cardId];
      if (st?.phase !== 'rendered') {
        setError(t.errorPreviewFirst);
        return;
      }
      if (st.failedQa) {
        setError(t.errorPublishFailedQa);
        return;
      }
      setBusy(true);
      setBusyLabel(t.busyPublishing);
      setError('');
      try {
        const data = await apiFetch<{ projectSlug: string }>('/publish', {
          sessionId,
          cardId,
          approve: true,
        });
        setProjectSlug(data.projectSlug);
        const publishedUrl = iconStatus[cardId]?.publishedUrl;
        setCardUi((u) => {
          const cur = u[cardId];
          const next = {
            ...u,
            [cardId]: {
              ...cur,
              phase: 'published' as const,
              needsRepublish: false,
              catalogStatus: 'current' as const,
              publishedSrc:
                publishedUrl && !cur?.publishedSrc
                  ? `${publishedUrl}?t=${Date.now()}`
                  : cur?.publishedSrc,
            },
          };
          applyFlowStep(sessionId, cards, next);
          return next;
        });
        setSuccess(t.successPublishDone(data.projectSlug));
        await loadRegistry();
        await refreshSessionList();
        try {
          const fresh = await apiFetch<SessionState>(`/session/${sessionId}/state`);
          setIconStatus(iconStatusFromState(fresh));
        } catch {
          // ignore
        }
      } catch (e) {
        setError(
          e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
        );
      } finally {
        setBusy(false);
        setBusyLabel('');
      }
    },
    [applyFlowStep, cardUi, cards, iconStatus, loadRegistry, refreshSessionList, sessionId],
  );

  const publishReadyCount = useMemo(() => {
    return cards.filter((card) => {
      if (card.skipped) return false;
      if (!selections[card.id]) return false;
      const st = cardUi[card.id];
      if (!st?.previewSrc || st.failedQa) return false;
      if (st.phase === 'published' && !st.needsRepublish && st.catalogStatus !== 'outdated') {
        return false;
      }
      return true;
    }).length;
  }, [cards, cardUi, selections]);

  const executePublishAllReady = useCallback(async () => {
    if (!sessionId) return;
    setBusy(true);
    setBusyLabel(t.busyPublishingAll);
    setError('');
    try {
      const data = await apiFetch<{
        published: string[];
        errors: Array<{ cardId: string; message: string }>;
        message?: string;
      }>('/publish-ready', { sessionId, approve: true });
      await loadSessionState(sessionId);
      await loadRegistry();
      await refreshSessionList();
      setSuccess(data.message ?? t.publishReadyCount(data.published.length));
      if (data.errors.length > 0) {
        setError(
          data.errors.map((e) => `${e.cardId}: ${e.message}`).join('; '),
        );
      }
    } catch (e) {
      setError(
        e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
      );
    } finally {
      setBusy(false);
      setBusyLabel('');
    }
  }, [loadRegistry, loadSessionState, refreshSessionList, sessionId]);

  const publishAllReady = useCallback(() => {
    if (!sessionId || publishReadyCount <= 0) return;
    setConfirm({ kind: 'publishAllReady' });
  }, [publishReadyCount, sessionId]);

  const publish = useCallback(
    (cardId: string) => {
      if (!sessionId) return;
      const st = cardUi[cardId];
      if (st?.phase !== 'rendered') {
        setError(t.errorPreviewFirst);
        return;
      }
      if (st.failedQa) {
        setError(t.errorPublishFailedQa);
        return;
      }
      const card = cards.find((c) => c.id === cardId);
      setConfirm({
        kind: st.needsRepublish ? 'republish' : 'publish',
        cardId,
        cardTitle: card?.title,
      });
    },
    [cardUi, cards, sessionId],
  );

  const dismissConfirm = useCallback(() => {
    const prev = confirm;
    setConfirm(null);
    if (prev?.kind === 'sessionExists' && prev.sessionId) {
      setError(t.error409Hint(prev.sessionId));
    }
  }, [confirm]);

  const setSelection = useCallback(
    (cardId: string, conceptId: string) => {
      setSelections((s) => ({ ...s, [cardId]: conceptId }));
      setCardUi((u) => {
        const cur = u[cardId];
        if (!cur?.previewSrc) return u;
        if (cur.renderedConceptId === conceptId) return u;
        return {
          ...u,
          [cardId]: {
            ...cur,
            phase: 'pick',
            previewSrc: undefined,
            previewStale: true,
            renderedConceptId: undefined,
          },
        };
      });
      setError('');
      if (sessionId) {
        void apiFetch('/select-concept', { sessionId, cardId, concept: conceptId }).catch(
          () => undefined,
        );
      }
    },
    [sessionId],
  );

  const dismissError = useCallback(() => setError(''), []);
  const dismissSuccess = useCallback(() => setSuccess(''), []);
  const setPreviewError = useCallback(() => setError(t.errorPreviewLoad), []);

  const scrollToBlock = useCallback((blockKey: string) => {
    document.getElementById(`block-${blockKey}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const repairStructure = useCallback(async () => {
    if (!sessionId) return;
    setBusy(true);
    setBusyLabel(t.busyRepairStructure);
    setError('');
    try {
      await apiFetch(`/session/${sessionId}/repair-structure`, {});
      const state = await apiFetch<SessionState>(`/session/${sessionId}/state`);
      await hydrateFromState(state, { silent: true });
      setSuccess(t.successRepairStructure);
      await refreshSessionList();
    } catch (e) {
      setError(
        e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
      );
    } finally {
      setBusy(false);
      setBusyLabel('');
    }
  }, [hydrateFromState, refreshSessionList, sessionId]);

  const applyPreviewVersion = useCallback(
    (
      cardId: string,
      payload: {
        previewSrc: string;
        conceptId?: string;
        failedQa?: boolean;
        qualityWarnings?: string[];
      },
    ) => {
      if (payload.conceptId) {
        setSelections((s) => ({ ...s, [cardId]: payload.conceptId! }));
      }
      setCardUi((u) => {
        const prev = u[cardId];
        if (!prev) return u;
        return {
          ...u,
          [cardId]: {
            ...prev,
            previewSrc: payload.previewSrc,
            previewStale: false,
            renderedConceptId: payload.conceptId ?? prev.renderedConceptId,
            failedQa: payload.failedQa,
            qualityWarnings: payload.qualityWarnings,
          },
        };
      });
    },
    [],
  );

  const toggleCardSkipped = useCallback(
    async (cardId: string, skipped: boolean) => {
      if (!sessionId) return;
      setError('');
      try {
        await apiFetch(`/session/${sessionId}/card-skipped`, { cardId, skipped });
        setCards((list) =>
          list.map((c) => (c.id === cardId ? { ...c, skipped } : c)),
        );
      } catch (e) {
        setError(
          e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
        );
      }
    },
    [sessionId],
  );

  const normalizePageUrl = useCallback((raw: string) => {
    try {
      const u = new URL(raw.trim());
      u.hash = '';
      const p = u.pathname.replace(/\/+$/, '') || '/';
      return `${u.origin}${p}`.toLowerCase();
    } catch {
      return raw.trim().toLowerCase();
    }
  }, []);

  const runExtendPageUrl = useCallback(
    async (pageUrl: string) => {
      if (!sessionId) return;
      const trimmed = pageUrl.trim();
      if (!trimmed) {
        throw new Error(t.urlRequired);
      }
      const norm = normalizePageUrl(trimmed);
      if (pages.some((p) => normalizePageUrl(p.url) === norm)) {
        throw new Error(t.extendPageDuplicateUrl);
      }
      const data = await apiFetch<{
        addedBlocks: number;
        addedCards: number;
        message?: string;
      }>(`/session/${sessionId}/extend-page`, { url: trimmed });
      const state = await apiFetch<SessionState>(`/session/${sessionId}/state`);
      await hydrateFromState(state, { silent: true });
      return data;
    },
    [hydrateFromState, normalizePageUrl, pages, sessionId],
  );

  const extendPage = useCallback(
    async (rowIndex?: number) => {
      const queue =
        rowIndex !== undefined
          ? [extendPageUrls[rowIndex] ?? ''].map((u) => u.trim()).filter(Boolean)
          : extendPageUrls.map((u) => u.trim()).filter(Boolean);
      if (queue.length === 0) {
        setError(t.urlRequired);
        return;
      }
      setBusy(true);
      setBusyLabel(
        queue.length > 1 ? t.busyExtendPageQueue : t.busyExtendPage,
      );
      setError('');
      try {
        let last: { addedBlocks: number; addedCards: number; message?: string } | undefined;
        for (const url of queue) {
          last = await runExtendPageUrl(url);
        }
        if (rowIndex === undefined) setExtendPageUrls(['']);
        else {
          setExtendPageUrls((rows) =>
            rows.map((u, i) => (i === rowIndex ? '' : u)),
          );
        }
        if (last) {
          setSuccess(
            last.addedCards === 0
              ? t.successExtendPageNext
              : (last.message ??
                  t.successExtendPage(last.addedBlocks, last.addedCards)),
          );
        }
        await refreshSessionList();
      } catch (e) {
        setError(
          e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
        );
      } finally {
        setBusy(false);
        setBusyLabel('');
      }
    },
    [extendPageUrls, refreshSessionList, runExtendPageUrl],
  );

  const addExtendPageRow = useCallback(() => {
    setExtendPageUrls((rows) => [...rows, '']);
  }, []);

  const removeExtendPageRow = useCallback((index: number) => {
    setExtendPageUrls((rows) =>
      rows.length <= 1 ? [''] : rows.filter((_, i) => i !== index),
    );
  }, []);

  const setExtendPageUrlAt = useCallback((index: number, value: string) => {
    setExtendPageUrls((rows) => rows.map((u, i) => (i === index ? value : u)));
  }, []);

  const fillExtendPageUrl = useCallback((url: string) => {
    setExtendPageUrls((rows) => {
      const emptyIdx = rows.findIndex((u) => !u.trim());
      if (emptyIdx >= 0) {
        return rows.map((u, i) => (i === emptyIdx ? url : u));
      }
      return [...rows, url];
    });
  }, []);

  const closeSession = useCallback(() => {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // ignore
    }
    setSessionId('');
    setProjectSlug('');
    setFlowStep(1);
    setDna(null);
    setIconStyleBlock(undefined);
    setCards([]);
    setBlocks(undefined);
    setPages([]);
    setConceptSets({});
    setSelections({});
    setCardUi({});
    setIconStatus({});
    setAppliedIconSetStyleId('');
    setExtendPageUrls(['']);
    setSearchQuery('');
    setResumed(false);
    setError('');
    setSuccess(t.successSessionClosed);
  }, []);

  const requestDeleteSession = useCallback((targetId: string) => {
    setConfirm({ kind: 'deleteSession', sessionId: targetId });
  }, []);

  const executeDeleteSession = useCallback(
    async (targetId: string) => {
      setBusy(true);
      setError('');
      try {
        await apiDelete<{ ok: boolean; message?: string }>(
          `/session/${targetId}`,
          { confirm: true },
        );
        if (targetId === sessionId) {
          closeSession();
        }
        await refreshSessionList();
        setSuccess(apiMessages.sessionDeleted);
      } catch (e) {
        setError(
          e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
        );
      } finally {
        setBusy(false);
      }
    },
    [closeSession, refreshSessionList, sessionId],
  );

  const acceptConfirm = useCallback(() => {
    const current = confirm;
    setConfirm(null);
    if (!current) return;
    if (current.kind === 'forceNew') {
      void executeRunStart(true);
    } else if (current.kind === 'sessionExists' && current.sessionId) {
      void resumeSession(current.sessionId);
    } else if (
      (current.kind === 'publish' || current.kind === 'republish') &&
      current.cardId
    ) {
      void executePublish(current.cardId);
    } else if (current.kind === 'promptQualityLow' && current.cardId) {
      void previewRender(current.cardId, true);
    } else if (current.kind === 'publishAllReady') {
      void executePublishAllReady();
    } else if (current.kind === 'deleteSession' && current.sessionId) {
      void executeDeleteSession(current.sessionId);
    }
  }, [
    confirm,
    executeDeleteSession,
    executePublish,
    executePublishAllReady,
    executeRunStart,
    previewRender,
    resumeSession,
  ]);

  const refreshIconStyle = useCallback(
    async (refreshConcepts: boolean) => {
      if (!sessionId) return;
      setBusy(true);
      setBusyLabel(
        refreshConcepts ? t.busyRefreshConcepts : t.busyRefreshBible,
      );
      setError('');
      try {
        const data = await apiFetch<{ styleBlock: string; iconSetStyleId?: string }>(
          `/session/${sessionId}/refresh-icon-style`,
          { refreshConcepts, iconSetStyleId },
        );
        setIconStyleBlock(data.styleBlock);
        if (data.iconSetStyleId) {
          persistIconSetStyle(data.iconSetStyleId);
          setAppliedIconSetStyleId(data.iconSetStyleId);
        }
        const state = await apiFetch<SessionState>(`/session/${sessionId}/state`);
        await hydrateFromState(state, { silent: true });
        if (refreshConcepts) {
          const sets: Record<string, ConceptSet> = {};
          for (const card of state.cards) {
            if (!state.conceptCardIds.includes(card.id)) continue;
            try {
              sets[card.id] = await apiFetch<ConceptSet>(
                `/session/${sessionId}/concepts/${card.id}`,
              );
            } catch {
              // skip
            }
          }
          setConceptSets(sets);
        }
        setSuccess(
          refreshConcepts ? t.successRefreshConcepts : t.successRefreshBible,
        );
      } catch (e) {
        setError(
          e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
        );
      } finally {
        setBusy(false);
        setBusyLabel('');
      }
    },
    [iconSetStyleId, persistIconSetStyle, sessionId],
  );

  const applyIconSetStyle = useCallback(
    async (refreshConcepts: boolean) => {
      if (!sessionId || !iconSetStyleId) return;
      setBusy(true);
      setBusyLabel(
        refreshConcepts ? t.busyRefreshConcepts : t.busyRefreshBible,
      );
      setError('');
      try {
        const data = await apiFetch<{
          styleBlock: string;
          iconSetStyleId: string;
        }>(`/session/${sessionId}/icon-set-style`, {
          iconSetStyleId,
          refreshConcepts,
        });
        setIconStyleBlock(data.styleBlock);
        persistIconSetStyle(data.iconSetStyleId);
        setAppliedIconSetStyleId(data.iconSetStyleId);
        const state = await apiFetch<SessionState>(`/session/${sessionId}/state`);
        await hydrateFromState(state, { silent: true });
        if (refreshConcepts) {
          const sets: Record<string, ConceptSet> = {};
          for (const card of state.cards) {
            if (!state.conceptCardIds.includes(card.id)) continue;
            try {
              sets[card.id] = await apiFetch<ConceptSet>(
                `/session/${sessionId}/concepts/${card.id}`,
              );
            } catch {
              // skip
            }
          }
          setConceptSets(sets);
        }
        const label =
          styleOptions.find((o) => o.id === data.iconSetStyleId)?.labelRu ??
          state.iconSetStyleLabel ??
          data.iconSetStyleId;
        setSuccess(t.successIconSetStyleChanged(label));
      } catch (e) {
        setError(
          e instanceof Error ? t.formatApiError(e.message) : t.formatApiError(String(e)),
        );
      } finally {
        setBusy(false);
        setBusyLabel('');
      }
    },
    [iconSetStyleId, persistIconSetStyle, sessionId, styleOptions],
  );

  const publishedCount = Object.values(cardUi).filter((c) => c.phase === 'published').length;

  const stylePendingApply = Boolean(
    sessionId && iconSetStyleId && appliedIconSetStyleId !== iconSetStyleId,
  );
  const needsStyleRefresh = Boolean(
    sessionId && (!iconStyleBlock?.trim() || stylePendingApply),
  );

  useEffect(() => {
    if (!sessionId || busy || !iconSetStyleId || !stylePendingApply) return;
    if (styleApplyTimerRef.current) clearTimeout(styleApplyTimerRef.current);
    styleApplyTimerRef.current = setTimeout(() => {
      void applyIconSetStyle(false);
    }, 400);
    return () => {
      if (styleApplyTimerRef.current) clearTimeout(styleApplyTimerRef.current);
    };
  }, [sessionId, busy, iconSetStyleId, stylePendingApply, applyIconSetStyle]);

  return {
    url,
    setUrl,
    sessionId,
    projectSlug,
    flowStep,
    dna,
    iconStyleBlock,
    iconSetStyleId,
    appliedIconSetStyleId,
    iconSetStyleLabel,
    styleOptions,
    stylePendingApply,
    setIconSetStyleId: persistIconSetStyle,
    cards,
    blocks,
    structureAudit,
    pages,
    searchQuery,
    setSearchQuery,
    extendPageUrls,
    addExtendPageRow,
    removeExtendPageRow,
    setExtendPageUrlAt,
    fillExtendPageUrl,
    conceptSets,
    selections,
    cardUi,
    iconStatus,
    sessionList,
    registry,
    busy,
    busyLabel,
    error,
    success,
    resumed,
    sessionsError,
    apiHealthMessage,
    apiHealthOk,
    sessionsLoading,
    needsStyleRefresh,
    cardsRef,
    publishedCount,
    publishReadyCount,
    hasRegistry: registry.length > 0,
    confirm,
    refreshSessionList,
    resumeSession,
    runStart,
    previewRender,
    publish,
    publishAllReady,
    requestDeleteSession,
    extendPage,
    scrollToBlock,
    repairStructure,
    applyPreviewVersion,
    toggleCardSkipped,
    closeSession,
    refreshIconStyle,
    applyIconSetStyle,
    setSelection,
    dismissError,
    dismissSuccess,
    setPreviewError,
    acceptConfirm,
    dismissConfirm,
  };
}
