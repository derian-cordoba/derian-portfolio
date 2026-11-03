import type { Locale } from '@/domain/locale';
import { gatewayScenarios, gatewaySource } from '@/content/gateway-scenarios';
import { walkthroughTranslations } from '@/i18n/walkthrough';

export function createWalkthroughViewModel(locale: Locale) {
  return gatewayScenarios.map((scenario) => ({
    id: scenario.id,
    status: scenario.status,
    ...walkthroughTranslations[locale][scenario.id],
    configuration: JSON.stringify(scenario.configuration, null, 2),
    sourceHref: `${gatewaySource}/${scenario.examplePath}`,
    testsHref: `${gatewaySource}/${scenario.testPath}`,
  }));
}
