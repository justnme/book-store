import BaseTheme from './base.js';
import type Quill from '../core.js';
import type Toolbar from '../modules/toolbar.js';
import type { ThemeOptions } from '../core/theme.js';
declare class SnowTheme extends BaseTheme {
    constructor(quill: Quill, options: ThemeOptions);
    extendToolbar(toolbar: Toolbar): void;
}
export default SnowTheme;
