import type * as mode from './vueMode';
import { Emitter, type IEvent, languages } from 'monaco-editor-core';

export interface ModeConfiguration {
    hovers?: boolean
}

export interface LanguageServiceDefaults {
	readonly languageId: string;
	readonly onDidChange: IEvent<LanguageServiceDefaults>;
	readonly modeConfiguration: ModeConfiguration;
}

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _modeConfiguration!: ModeConfiguration;
	private _languageId: string;

	constructor(
		languageId: string,
		modeConfiguration: ModeConfiguration
	) {
		this._languageId = languageId;
		this.setModeConfiguration(modeConfiguration);
	}

	get onDidChange(): IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get modeConfiguration(): ModeConfiguration {
		return this._modeConfiguration;
	}

	setModeConfiguration(modeConfiguration: ModeConfiguration): void {
		this._modeConfiguration = modeConfiguration || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const modeConfigurationDefault: Required<ModeConfiguration> = {
    hovers: true
};

export const vueDefaults: LanguageServiceDefaults = new LanguageServiceDefaultsImpl(
	'vue',
	modeConfigurationDefault
);

(<any>languages).vue = { vueDefaults };

function getMode(): Promise<typeof mode> {
	return import('./vueMode');
}

languages.register({
	id: 'vue',
	extensions: ['.vue'],
	aliases: ['VUE', 'vue']
});

languages.onLanguage('vue', () => {
	getMode().then((mode) => mode.setupMode(vueDefaults));
});
