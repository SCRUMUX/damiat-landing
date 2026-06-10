import { PageHeader } from './components/PageHeader.js';
import { HowToAccordion } from './components/HowToAccordion.js';
import { ApiHealthBanner } from './components/ApiHealthBanner.js';
import { SessionsPanel } from './components/SessionsPanel.js';
import { FlowStepsNav } from './components/FlowStepsNav.js';
import { StatusAlerts } from './components/StatusAlerts.js';
import { GlobalBusy } from './components/GlobalBusy.js';
import { AnalyzePanel } from './components/AnalyzePanel.js';
import { SessionToolbar } from './components/SessionToolbar.js';
import { SessionMaintenancePanel } from './components/SessionMaintenancePanel.js';
import { CardsWorkflow } from './components/CardsWorkflow.js';
import { BlocksMapPanel } from './components/BlocksMapPanel.js';
import { ExtendPagePanel } from './components/ExtendPagePanel.js';
import { IconGalleryPanel } from './components/IconGalleryPanel.js';
import { StorybookPanel } from './components/StorybookPanel.js';
import { StoragePathsPanel } from './components/StoragePathsPanel.js';
import { PublishBatchPanel } from './components/PublishBatchPanel.js';
import { ConfirmDialog } from './components/ConfirmDialog.js';
import { useSynaptikSession } from './hooks/useSynaptikSession.js';
import { pageShellClass, pageStackClass } from './layout.js';
import { t } from './i18n/ru.js';

export function App() {
  const s = useSynaptikSession();

  return (
    <div className={`${pageShellClass} ${pageStackClass}`}>
      <PageHeader />
      <ApiHealthBanner ok={s.apiHealthOk} message={s.apiHealthMessage} />
      <HowToAccordion />
      <SessionsPanel
        sessionList={s.sessionList}
        activeSessionId={s.sessionId}
        sessionsError={s.sessionsError}
        sessionsLoading={s.sessionsLoading}
        apiUnavailable={!s.apiHealthOk && Boolean(s.apiHealthMessage)}
        busy={s.busy}
        onOpen={s.resumeSession}
        onRefresh={s.refreshSessionList}
        onCloseActive={s.closeSession}
        onDeleteSession={s.requestDeleteSession}
      />
      <FlowStepsNav flowStep={s.flowStep} />
      <StatusAlerts
        success={s.success}
        error={s.error}
        resumed={s.resumed}
        sessionId={s.sessionId}
        onDismissError={s.dismissError}
        onDismissSuccess={s.dismissSuccess}
      />
      <GlobalBusy busy={s.busy} label={s.busyLabel} />
      {s.sessionId && (
        <SessionToolbar
          sessionId={s.sessionId}
          projectSlug={s.projectSlug}
          iconSetStyleLabel={s.iconSetStyleLabel}
          busy={s.busy}
          apiOk={s.apiHealthOk}
          url={s.url}
          onCloseSession={s.closeSession}
          onNewAnalysis={() => s.runStart(false)}
          onForceNew={() => s.runStart(true)}
        />
      )}
      {s.sessionId && s.flowStep >= 2 && (
        <SessionMaintenancePanel
          iconStyleBlock={s.iconStyleBlock}
          iconSetStyleId={s.iconSetStyleId}
          iconSetStyleLabel={s.iconSetStyleLabel}
          styleOptions={s.styleOptions}
          appliedIconSetStyleId={s.appliedIconSetStyleId}
          needsStyleRefresh={s.needsStyleRefresh}
          stylePendingApply={s.stylePendingApply}
          busy={s.busy}
          onIconSetStyleChange={s.setIconSetStyleId}
          onRefreshStyle={s.refreshIconStyle}
          onApplyIconSetStyle={s.applyIconSetStyle}
        />
      )}
      <AnalyzePanel
        url={s.url}
        iconSetStyleId={s.iconSetStyleId}
        styleOptions={s.styleOptions}
        busy={s.busy}
        apiOk={s.apiHealthOk}
        flowStep={s.flowStep}
        resumed={s.resumed}
        busyLabel={s.busyLabel}
        compact={Boolean(s.sessionId)}
        onUrlChange={s.setUrl}
        onIconSetStyleChange={s.setIconSetStyleId}
        onRun={s.runStart}
      />
      {s.sessionId && s.flowStep >= 2 && (
        <>
          <StoragePathsPanel
            sessionId={s.sessionId}
            publishReadyCount={s.publishReadyCount}
          />
          <PublishBatchPanel
            publishReadyCount={s.publishReadyCount}
            busy={s.busy}
            onPublishAllReady={s.publishAllReady}
          />
          <ExtendPagePanel
            sourceUrl={s.url}
            pages={s.pages}
            pageUrls={s.extendPageUrls}
            busy={s.busy}
            apiOk={s.apiHealthOk}
            onPageUrlChange={s.setExtendPageUrlAt}
            onAddRow={s.addExtendPageRow}
            onRemoveRow={s.removeExtendPageRow}
            onExtendRow={s.extendPage}
            onExtendAll={() => void s.extendPage()}
            onPickScannedUrl={s.fillExtendPageUrl}
          />
          <BlocksMapPanel
            cards={s.cards}
            blocks={s.blocks}
            cardUi={s.cardUi}
            searchQuery={s.searchQuery}
            structureAudit={s.structureAudit}
            busy={s.busy}
            onSearchChange={s.setSearchQuery}
            onScrollToBlock={s.scrollToBlock}
            onRepairStructure={s.repairStructure}
          />
        </>
      )}
      {s.sessionId && s.flowStep >= 2 && (
        <CardsWorkflow
          ref={s.cardsRef}
          sessionId={s.sessionId}
          cards={s.cards}
          blocks={s.blocks}
          searchQuery={s.searchQuery}
          dna={s.dna}
          iconStyleBlock={s.iconStyleBlock}
          conceptSets={s.conceptSets}
          selections={s.selections}
          cardUi={s.cardUi}
          busy={s.busy}
          onSelectConcept={s.setSelection}
          onPreview={s.previewRender}
          onPublish={s.publish}
          onPreviewError={s.setPreviewError}
          onPromptCheckError={(msg) => s.setError(msg)}
          onToggleSkipped={s.toggleCardSkipped}
          onPreviewVersionActive={s.applyPreviewVersion}
        />
      )}
      {s.sessionId && s.flowStep >= 2 && s.cards.length > 0 && (
        <IconGalleryPanel
          cards={s.cards}
          blocks={s.blocks}
          searchQuery={s.searchQuery}
          cardUi={s.cardUi}
          iconStatus={s.iconStatus}
          conceptSets={s.conceptSets}
          selections={s.selections}
          projectSlug={s.projectSlug}
          sessionId={s.sessionId}
          busy={s.busy}
          onSelectConcept={s.setSelection}
          onPreview={s.previewRender}
          onPublish={s.publish}
          onPreviewError={s.setPreviewError}
          onPreviewVersionActive={s.applyPreviewVersion}
        />
      )}
      <StorybookPanel
        registry={s.registry}
        hasRegistry={s.hasRegistry}
        publishedCount={s.publishedCount}
        projectSlug={s.projectSlug}
      />
      {s.sessionId && (
        <p className="text-style-caption text-[var(--color-text-secondary)] m-0 pt-[var(--space-content-m)]">
          {t.activeSession(s.sessionId)}
        </p>
      )}
      <ConfirmDialog
        state={s.confirm}
        onConfirm={s.acceptConfirm}
        onCancel={s.dismissConfirm}
      />
    </div>
  );
}
