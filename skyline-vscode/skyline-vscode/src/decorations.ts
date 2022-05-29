
import { builtinModules } from 'module';
import * as vscode from 'vscode';

export const simpleDecoration = vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    borderWidth: '1px',
    borderStyle: 'solid',
    overviewRulerColor: 'blue',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    gutterIconPath: 'resources/right-arrow.png', 
    gutterIconSize: 'auto',
    light: {
        // this color will be used in light color themes
        borderColor: 'darkblue'
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: 'lightblue'
    }
});
