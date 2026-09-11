/**
 * @fileoverview HTML engine for Bootstrap 5.
 * @version 1.0.0
 * @author Adrian G. (N-Gen Design) <ngendesign@email.com>
 * @license MIT
 * 
 * @class Slate
 * @description A simple, lightweight, open-source WYSIWYG Web text editor built with Bootstrap 5.
 * 
 * Features:
 * - Rich text formatting (bold, italic, underline, strikethrough)
 * - Font size selection
 * - Text and background colors with color picker
 * - Lists (ordered and unordered)
 * - Text alignment (left, center, right, justify)
 * - Tables with full management
 * - Image and media insertion
 * - Link creation and editing
 * - Code view for HTML editing
 * - Undo/Redo functionality
 * - Fullscreen mode
 * - Responsive design
 * - Dark theme support
 * - Bootstrap 5 compatible
 * 
 */
export class Slate {

    constructor(selectorOrElement, options = {}) {
        // If no selector or element is passed to Slate,
        if (!selectorOrElement) {
            // stop execution and throw error.
            throw new Error('Slate expects an Element or a String selector aa a parameter');
        }

        if (selectorOrElement.nodeType) {
            // If it is an element, assign it directly
            this.element = selectorOrElement;
        } else {
            // If it is a selector, trys to find element in the DOM
            this.element = document.querySelector(selectorOrElement);
        }

        // Default configuration
        this.defaults = {
            height: '400px',
            theme: 'bootstrap', // bootstrap, dark, light
            toolbar: 'full', // full, basic, minimal, or custom array
            fontSizes: [1, 2, 3, 4, 5, 6, 7],
            fontFamilies: [
                // Sans-Serif (The most reliable cross-platform category)
                "Arial",         // Universal on Windows, macOS, iOS; maps nicely on Android
                "Helvetica",     // Default on macOS and iOS; falls back smoothly elsewhere
                "Verdana",       // Widely available on desktop; strong readability on mobile screens
                // Serif (Excellent fallback mechanics across devices)
                "Times New Roman", // Native to Windows, macOS, and iOS
                "Georgia",         // Designed for digital screens; native to Windows, macOS, and iOS
                // Monospace (For code snippets and technical text)
                "Courier New",   // Universal on Windows, macOS, and iOS
                // Mobile System UI Aliases (Allows you to explicitly call native mobile fonts)
                "system-ui",     // Target native font (Segoe UI on Win, San Francisco on Apple, Roboto on Android)
                "Roboto",        // Pre-installed on virtually all modern Android devices
                "BlinkMacSystemFont" // Legacy native mapping wrapper for Apple devices
                // You can also use objects with displayName and value:
                // { displayName: 'My Custom Font', value: 'CustomFont, Arial, sans-serif' }
            ],
            colors: [
                '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF',
                '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
                '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE',
                '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
                '#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5',
                '#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B',
                '#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842',
                '#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031'
            ],
            onChange: null,
            onInit: null,
            showStatusBar: true,
            placeholder: null // Will be set from language file
        };

        // Toolbar configurations
        this.toolbarPresets = {
            full: [
                ['undo', 'redo'],
                ['bold', 'italic', 'underline', 'strikethrough'],
                ['fontname', 'fontsize'],
                ['forecolor', 'backcolor'],
                ['removeFormat'],
                ['insertUnorderedList', 'insertOrderedList'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                ['directionLTR', 'directionRTL'],
                ['paragraphLTR', 'paragraphRTL'],
                ['insertLink', 'insertImage', 'insertTable'],
                ['codeView', 'fullscreen']
            ],
            basic: [
                ['undo', 'redo'],
                ['bold', 'italic', 'underline'],
                ['fontsize'],
                ['forecolor'],
                ['insertUnorderedList', 'insertOrderedList'],
                ['directionLTR', 'directionRTL'],
                ['paragraphLTR', 'paragraphRTL'],
                ['insertLink'],
                ['codeView']
            ],
            minimal: [
                ['bold', 'italic', 'underline'],
                ['insertUnorderedList', 'insertOrderedList'],
                ['insertLink']
            ]
        };

        // Toolbar button definitions
        this.toolbarButtons = {
            undo: { icon: 'bi bi-arrow-counterclockwise', title: 'Undo (Ctrl+Z)', command: 'undo' },
            redo: { icon: 'bi bi-arrow-clockwise', title: 'Redo (Ctrl+Y)', command: 'redo' },
            bold: { icon: 'bi bi-type-bold', title: 'Bold (Ctrl+B)', command: 'bold' },
            italic: { icon: 'bi bi-type-italic', title: 'Italic (Ctrl+I)', command: 'italic' },
            underline: { icon: 'bi bi-type-underline', title: 'Underline (Ctrl+U)', command: 'underline' },
            strikethrough: { icon: 'bi bi-type-strikethrough', title: 'Strikethrough', command: 'strikethrough' },
            fontname: { type: 'select', title: 'Font Family', command: 'fontName'},
            fontsize: { type: 'select', title: 'Font Size', command: 'fontSize' },
            forecolor: { icon: 'bi bi-palette', title: 'Text Color', type: 'color', command: 'foreColor' },
            backcolor: { icon: 'bi bi-paint-bucket', title: 'Background Color', type: 'color', command: 'backColor' },
            removeFormat: { icon: 'bi bi-eraser', title: 'Clear Formatting', command: 'removeFormat' },
            insertUnorderedList: { icon: 'bi bi-list-ul', title: 'Bulleted List', command: 'insertUnorderedList' },
            insertOrderedList: { icon: 'bi bi-list-ol', title: 'Numbered List', command: 'insertOrderedList' },
            justifyLeft: { icon: 'bi bi-text-left', title: 'Align Left', command: 'justifyLeft' },
            justifyCenter: { icon: 'bi bi-text-center', title: 'Align Center', command: 'justifyCenter' },
            justifyRight: { icon: 'bi bi-text-right', title: 'Align Right', command: 'justifyRight' },
            justifyFull: { icon: 'bi bi-justify', title: 'Justify', command: 'justifyFull' },
            directionLTR: { icon: 'bi bi-text-left', title: 'Left to Right (LTR)', type: 'direction', direction: 'ltr', mode: 'inline' },
            directionRTL: { icon: 'bi bi-text-right', title: 'Right to Left (RTL)', type: 'direction', direction: 'rtl', mode: 'inline' },
            paragraphLTR: { icon: 'bi bi-text-paragraph', title: 'Paragraph Left to Right', type: 'direction', direction: 'ltr', mode: 'block' },
            paragraphRTL: { icon: 'bi bi-text-paragraph', title: 'Paragraph Right to Left', type: 'direction', direction: 'rtl', mode: 'block' },
            insertLink: { icon: 'bi bi-link-45deg', title: 'Insert Link', type: 'modal' },
            insertImage: { icon: 'bi bi-image', title: 'Insert Image', type: 'modal' },
            insertTable: { icon: 'bi bi-table', title: 'Insert Table', type: 'modal' },
            codeView: { icon: 'bi bi-code-slash', title: 'Code View', type: 'toggle' },
            fullscreen: { icon: 'bi bi-arrows-fullscreen', title: 'Fullscreen', type: 'toggle' }
        };

        // Combine them (options overwrites defaults)
        this.options = { ...this.defaults, ...options };

        if (options && options.colors) this.options.colors = options.colors;
        if (options && options.fontSizes) this.options.fontSizes = options.fontSizes;

        this.history = [];
        this.historyIndex = -1;
        this.isCodeView = false;
        this.isFullscreen = false;

        this.init();
    }

    init() {
        this.createEditor();
        this.attachEvents();
        this.updateHistory();
        this.updateStatusBar();

        if (this.options.onInit) {
            this.options.onInit.call(this, this);
        }

        const initEvent = new CustomEvent('slate:init', {
            detail: { instance: this },
            bubbles: true,
            cancelable: true
        });

        this.element.dispatchEvent(initEvent);

    }

    createEditor() {
        // Hide original textarea
        this.element.style.display = 'none';

        // Create editor wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('slate-canvas-wrapper');
        if (this.options.theme !== 'bootstrap') {
            this.wrapper.classList.add('theme-' + this.options.theme);
        }

        // Create toolbar
        this.toolbar = this.createToolbar();
        this.wrapper.append(this.toolbar);

        // Create content area
        this.contentArea = document.createElement('div');
        this.contentArea.classList.add('slate-canvas-content');
        this.contentArea.setAttribute('contenteditable', 'true');
        this.contentArea.style.setProperty('height', this.options.height);
        this.contentArea.innerHTML = this.element.innerText || this.element.value || '';
        this.wrapper.append(this.contentArea);

        // Create code view
        this.codeArea = document.createElement('textarea');
        this.codeArea.classList.add('slate-canvas-code');
        this.codeArea.style.setProperty('height', this.options.height, 'important');
        this.wrapper.append(this.codeArea);

        // Create statusbar
        if (this.options.showStatusBar) {
            this.statusBar = this.createStatusBar();
            this.wrapper.append(this.statusBar);
        }

        // Insert wrapper into original element layout container
        this.element.parentNode.insertBefore(this.wrapper, this.element.nextSibling);

        // Create modals
        this.createModals();
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.classList.add('slate-canvas-toolbar');
        const toolbarConfig = typeof this.options.toolbar === 'string'
            ? this.toolbarPresets[this.options.toolbar]
            : this.options.toolbar;

        toolbarConfig.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.classList.add('toolbar-group');

            group.forEach(buttonName => {
                const button = this.createToolbarButton(buttonName);
                if (button) {
                    groupEl.append(button);
                }
            });

            toolbar.append(groupEl);
        });

        return toolbar;
    }

    createToolbarButton(name) {
        const buttonDef = this.toolbarButtons[name];
        if (!buttonDef) return null;

        const title = (this.lang && this.lang.toolbar && this.lang.toolbar[name]) || buttonDef.title;

        if (buttonDef.type === 'select') {
            return this.createSelectButton(name, buttonDef);
        } else if (buttonDef.type === 'color') {
            return this.createColorButton(name, buttonDef);
        } else {
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('toolbar-btn');
            button.setAttribute('data-command', name);
            button.setAttribute('data-tooltip', title);

            if (buttonDef.type === 'direction') {
                button.setAttribute('data-direction', buttonDef.direction);
                button.setAttribute('data-mode', buttonDef.mode || 'inline');
            }

            button.innerHTML = '<i class="' + buttonDef.icon + '"></i>';
            return button;
        }
    }

    createSelectButton(name, buttonDef) {
        const select = document.createElement('select');
        select.classList.add('toolbar-select');
        select.setAttribute('data-command', name);

        if (name === 'fontname') {
            const label = (this.lang && this.lang.toolbar && this.lang.toolbar.fontname) || 'Font Family';
            select.insertAdjacentHTML("beforeend", `<option value="">${label}</option>`);
            this.options.fontFamilies.forEach(font => {
                // Support both string format and object format { displayName, value }
                if (typeof font === 'string') {
                    select.insertAdjacentHTML("beforeend", `<option value="${font}" style="font-family: ${font}">${font}</option>`);
                } else if (typeof font === 'object' && font.displayName && font.value) {
                    select.insertAdjacentHTML("beforeend", `<option value="${font.value}" style="font-family: ${font.value}">${font.displayName}</option>`);
                }
            });
        } else if (name === 'fontsize') {
            const label = (this.lang && this.lang.fontSizeLabel) || 'Font Size';
            select.insertAdjacentHTML("beforeend", `<option value="">${label}</option>`);
            this.options.fontSizes.forEach(size => {
                const sizeLabel = (this.lang && this.lang.fontSize && this.lang.fontSize[size]) || `Size ${size}`;
                select.insertAdjacentHTML("beforeend", `<option value="${size}">${sizeLabel}</option>`);
            });
        }

        return select;
    }

    createColorButton(name, buttonDef) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('color-picker-wrapper');
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn', 'color-picker-btn');
        const title = (this.lang && this.lang.toolbar && this.lang.toolbar[name]) || buttonDef.title;

        wrapper.setAttribute('data-tooltip', title);
        button.setAttribute('data-command', name);
        button.setAttribute('data-color-command', buttonDef.command);

        if (buttonDef.command === 'backColor') {
            button.style.setProperty('--indicator-color', '#ffeb3b');
            button.setAttribute('data-current-color', '#ffeb3b');
        } else {
            button.style.setProperty('--indicator-color', '#000000');
            button.setAttribute('data-current-color', '#000000');
        }

        const defaultColorValue = (buttonDef.command === 'backColor') ? '#ffeb3b' : '#000000';

        const dropdown = document.createElement('div');
        dropdown.classList.add('color-picker-dropdown');
        const colorGrid = document.createElement('div');
        colorGrid.classList.add('color-grid');

        this.options.colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.classList.add('color-option');
            colorOption.style.setProperty('background-color', color);
            colorOption.setAttribute('data-color', color);
            colorGrid.append(colorOption);
        });

        dropdown.append(colorGrid);

        const customColorWrapper = document.createElement('div');
        customColorWrapper.classList.add('color-input-wrapper');
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = defaultColorValue;
        const hexInput = document.createElement('input');
        hexInput.type = 'text';
        hexInput.placeholder = defaultColorValue;
        hexInput.maxLength = 7;
        hexInput.value = defaultColorValue;
        customColorWrapper.append(colorInput, hexInput);
        dropdown.append(customColorWrapper);

        wrapper.append(button, dropdown);
        return wrapper;
    }

    createStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.classList.add('slate-canvas-statusbar');
        const wordsLabel = (this.lang && this.lang.statusBar && this.lang.statusBar.words) || 'words';
        const charsLabel = (this.lang && this.lang.statusBar && this.lang.statusBar.characters) || 'characters';
        statusBar.insertAdjacentHTML("beforeend", `
                <div class="statusbar-left">
                    <span class="statusbar-item">
                        <i class="bi bi-info-circle"></i> 
                        <span class="word-count">0 ${wordsLabel}</span>
                    </span>
                    <span class="statusbar-item">
                        <span class="char-count">0 ${charsLabel}</span>
                    </span>
                </div>
            `);
        return statusBar;
    }

    createModals() {
        this.linkModal = this.createLinkModal();
        document.body.insertAdjacentHTML("beforeend", this.linkModal);

        this.imageModal = this.createImageModal();
        document.body.insertAdjacentHTML("beforeend", this.imageModal);

        this.tableModal = this.createTableModal();
        document.body.insertAdjacentHTML("beforeend", this.tableModal);
    }

    createLinkModal() {
        const m = (this.lang && this.lang.modal) || {};
        return `
                <div class="slate-canvas-modal" id="linkModal">
                    <div class="slate-canvas-modal-content">
                        <div class="slate-canvas-modal-header">
                            <h5>${m.insertLink || 'Insert Link'}</h5>
                            <button type="button" class="slate-canvas-modal-close">&times;</button>
                        </div>
                        <div class="slate-canvas-modal-body">
                            <div class="form-group">
                                <label>${m.linkText || 'Link Text:'}</label>
                                <input type="text" id="linkText" class="form-control" placeholder="${m.linkTextPlaceholder || 'Enter link text'}">
                            </div>
                            <div class="form-group">
                                <label>${m.linkUrl || 'URL:'}</label>
                                <input type="url" id="linkUrl" class="form-control" placeholder="${m.linkUrlPlaceholder || 'https://example.com'}" required>
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="linkNewTab">
                                    ${m.linkNewTab || 'Open in new tab'}
                                </label>
                            </div>
                        </div>
                        <div class="slate-canvas-modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">${m.cancel || 'Cancel'}</button>
                            <button type="button" class="btn btn-primary" id="insertLinkBtn">${m.insertLink || 'Insert Link'}</button>
                        </div>
                    </div>
                </div>
            `;
    }

    createImageModal() {
        const m = (this.lang && this.lang.modal) || {};
        return `
                <div class="slate-canvas-modal" id="imageModal">
                    <div class="slate-canvas-modal-content">
                        <div class="slate-canvas-modal-header">
                            <h5>${m.insertImage || 'Insert Image'}</h5>
                            <button type="button" class="slate-canvas-modal-close">&times;</button>
                        </div>
                        <div class="slate-canvas-modal-body">
                            <div class="form-group">
                                <label>${m.imageUrl || 'Image URL:'}</label>
                                <input type="url" id="imageUrl" class="form-control" placeholder="${m.imageUrlPlaceholder || 'https://example.com/image.jpg'}" required>
                            </div>
                            <div class="form-group">
                                <label>${m.imageAlt || 'Alt Text:'}</label>
                                <input type="text" id="imageAlt" class="form-control" placeholder="${m.imageAltPlaceholder || 'Image description'}">
                            </div>
                            <div class="form-group">
                                <label>${m.imageWidth || 'Width (optional):'}</label>
                                <input type="text" id="imageWidth" class="form-control" placeholder="${m.imageWidthPlaceholder || 'e.g., 300px or 100%'}">
                            </div>
                        </div>
                        <div class="slate-canvas-modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">${m.cancel || 'Cancel'}</button>
                            <button type="button" class="btn btn-primary" id="insertImageBtn">${m.insertImage || 'Insert Image'}</button>
                        </div>
                    </div>
                </div>
            `;
    }

    createTableModal() {
        const m = (this.lang && this.lang.modal) || {};
        return `
                <div class="slate-canvas-modal" id="tableModal">
                    <div class="slate-canvas-modal-content">
                        <div class="slate-canvas-modal-header">
                            <h5>${m.insertTable || 'Insert Table'}</h5>
                            <button type="button" class="slate-canvas-modal-close">&times;</button>
                        </div>
                        <div class="slate-canvas-modal-body">
                            <p>${m.tableSelectSize || 'Select table size:'}</p>
                            <div class="table-builder" id="tableBuilder"></div>
                            <div class="table-size-display" id="tableSize">1 x 1</div>
                        </div>
                        <div class="slate-canvas-modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">${m.cancel || 'Cancel'}</button>
                            <button type="button" class="btn btn-primary" id="insertTableBtn">${m.insertTable || 'Insert Table'}</button>
                        </div>
                    </div>
                </div>
            `;
    }

    attachEvents() {
        const self = this;

        // Toolbar button clicks
        this.toolbar.addEventListener('click', function (e) {
            const btn = e.target.closest('.toolbar-btn');
            if (btn && self.toolbar.contains(btn)) {
                e.preventDefault();
                const command = btn.getAttribute('data-command');
                const direction = btn.getAttribute('data-direction');

                if (command === 'codeView') {
                    self.toggleCodeView();
                } else if (command === 'fullscreen') {
                    self.toggleFullscreen();
                } else if (command === 'insertLink') {
                    self.showLinkModal();
                } else if (command === 'insertImage') {
                    self.showImageModal();
                } else if (command === 'insertTable') {
                    self.showTableModal();
                } else if (direction) {
                    const mode = btn.getAttribute('data-mode') || self.toolbarButtons[command].mode || 'inline';
                    self.setDirection(direction, mode);
                } else {
                    self.execCommand(self.toolbarButtons[command].command);
                }

                self.contentArea.focus();
            }
        });

        // Toolbar select changes
        this.toolbar.addEventListener('change', function (event) {
            if (event.target.matches('.toolbar-select')) {
                const select = event.target;
                const command = select.getAttribute('data-command');
                const value = select.value;

                if (value) {
                    self.execCommand(self.toolbarButtons[command].command, value);
                    select.value = '';
                }

                self.contentArea.focus();
            }
        });

        // Color picker toggle dropdown
        this.toolbar.addEventListener('click', function (e) {
            const colorBtn = e.target.closest('.color-picker-btn');
            if (colorBtn) {
                e.stopPropagation();
                self.saveSelection();

                const dropdown = colorBtn.nextElementSibling;
                if (dropdown) dropdown.classList.toggle('show');
            }
        });

        // Color palette choices
        this.toolbar.addEventListener('click', function (e) {
            if (e.target.matches('.color-option')) {
                e.preventDefault();
                e.stopPropagation();

                const option = e.target;
                const color = option.getAttribute('data-color');
                const wrapper = option.closest('.color-picker-wrapper');
                const colorBtn = wrapper.querySelector('.color-picker-btn');
                const colorCommand = colorBtn.getAttribute('data-color-command');

                option.closest('.color-picker-dropdown').classList.remove('show');
                self.contentArea.focus();

                if (self.savedSelection) {
                    self.restoreSelection();
                }

                document.execCommand(colorCommand, false, color);
                self.updateHistory();

                colorBtn.style.setProperty('--indicator-color', color);
                self.contentArea.focus();
            }
        });

        // Native Color Picker input changes
        this.toolbar.addEventListener('change', function (event) {
            if (event.target.matches('.color-picker-dropdown input[type="color"]')) {
                const colorInput = event.target;
                const color = colorInput.value;
                colorInput.nextElementSibling.value = color;

                const wrapper = colorInput.closest('.color-picker-wrapper');
                const colorBtn = wrapper.querySelector('.color-picker-btn');
                const colorCommand = colorBtn.getAttribute('data-color-command');

                self.contentArea.focus();
                if (self.savedSelection) {
                    self.restoreSelection();
                }

                document.execCommand(colorCommand, false, color);
                self.updateHistory();

                colorBtn.style.setProperty('--indicator-color', color);
                colorInput.closest('.color-picker-dropdown').classList.remove('show');
            }
        });

        // Manual Hex code entries
        this.toolbar.addEventListener('keypress', function (e) {
            if (e.target.matches('.color-picker-dropdown input[type="text"]')) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    const textInput = e.target;
                    const color = textInput.value;
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                        textInput.previousElementSibling.value = color;

                        const wrapper = textInput.closest('.color-picker-wrapper');
                        const colorBtn = wrapper.querySelector('.color-picker-btn');
                        const colorCommand = colorBtn.getAttribute('data-color-command');

                        self.contentArea.focus();
                        if (self.savedSelection) {
                            self.restoreSelection();
                        }

                        document.execCommand(colorCommand, false, color);
                        self.updateHistory();

                        colorBtn.style.setProperty('--indicator-color', color);
                        textInput.closest('.color-picker-dropdown').classList.remove('show');
                    }
                }
            }
        });

        // Close color picker on outside click
        document.body.addEventListener('click', function (e) {
            if (!e.target.closest('.color-picker-wrapper')) {
                document.querySelectorAll('.color-picker-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });

        // Content changes
        this.contentArea.addEventListener('input', function () {
            self.updateHistory();
            self.updateStatusBar();
            self.triggerChange();
        });

        // Update toolbar state when selection changes
        const handleSelectionUpdate = function () {
            self.updateToolbarState();
        };
        this.contentArea.addEventListener('mouseup', handleSelectionUpdate);
        this.contentArea.addEventListener('keyup', handleSelectionUpdate);

        this.contentArea.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                self.undo();
            }
            else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
                e.preventDefault();
                self.redo();
            }
            else if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                self.execCommand('bold');
            }
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                self.execCommand('italic');
            }
            else if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                self.execCommand('underline');
            }
            else if (e.key === 'Tab') {
                e.preventDefault();
                self.execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        });

        // Code view changes
        this.codeArea.addEventListener('input', function () {
            self.triggerChange();
        });

        // Focus/Blur events
        this.contentArea.addEventListener('focus', function () {
            const focusEvent = new CustomEvent('slate:focus', { bubbles: true });
            self.element.dispatchEvent(focusEvent);
            setTimeout(() => {
                self.updateToolbarState();
            }, 10);
        });

        this.contentArea.addEventListener('blur', function () {
            const blurEvent = new CustomEvent('slate:blur', { bubbles: true });
            self.element.dispatchEvent(blurEvent);
        });

        // Modal triggers
        document.getElementById('insertLinkBtn').addEventListener('click', function () {
            self.insertLink();
        });

        document.getElementById('insertImageBtn').addEventListener('click', function () {
            self.insertImage();
        });

        document.getElementById('insertTableBtn').addEventListener('click', function () {
            self.insertTable();
        });

        // Handle Close Events inside modals natively
        document.body.addEventListener('click', function (e) {
            if (e.target.matches('.slate-canvas-modal-close') || e.target.closest('[data-dismiss="modal"]')) {
                const targetModal = e.target.closest('.slate-canvas-modal');
                if (targetModal) targetModal.classList.remove('show');
            }
        });

        // Close modal on outside backdrop click
        document.querySelectorAll('.slate-canvas-modal').forEach(modal => {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // Table builder
        this.initTableBuilder();
    }

    initTableBuilder() {
        const self = this;
        const builder = document.getElementById('tableBuilder');
        let selectedRows = 1;
        let selectedCols = 1;

        // Create 10x10 grid
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('table-cell');
            cell.dataset.row = (Math.floor(i / 10) + 1);
            cell.dataset.col = ((i % 10) + 1);
            builder.append(cell);
        }

        builder.addEventListener('mouseover', function (e) {
            const cell = e.target.closest('.table-cell');
            if (cell && builder.contains(cell)) {
                const row = parseInt(cell.getAttribute('data-row'), 10);
                const col = parseInt(cell.getAttribute('data-col'), 10);
                selectedRows = row;
                selectedCols = col;

                builder.querySelectorAll('.table-cell').forEach(c => {
                    const cRow = parseInt(c.getAttribute('data-row'), 10);
                    const cCol = parseInt(c.getAttribute('data-col'), 10);
                    if (cRow <= row && cCol <= col) {
                        c.classList.add('hover');
                    } else {
                        c.classList.remove('hover');
                    }
                });

                document.getElementById('tableSize').textContent = `${row} x ${col}`;
            }
        });

        builder.addEventListener('click', function (e) {
            if (e.target.matches('.table-cell')) {
                self.selectedTableRows = selectedRows;
                self.selectedTableCols = selectedCols;
                self.insertTable();
            }
        });
    }

    saveSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            this.savedSelection = selection.getRangeAt(0);
        }
    }

    restoreSelection() {
        if (this.savedSelection) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.savedSelection);
        }
    }

    execCommand(command, value = null) {
        document.execCommand(command, false, value);
        this.updateHistory();
        this.updateToolbarState();
    }

    updateHistory() {
        const content = this.contentArea.innerHTML;

        if (this.history[this.historyIndex] === content) {
            return;
        }

        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(content);
        this.historyIndex++;

        if (this.history.length > 100) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.contentArea.innerHTML = this.history[this.historyIndex];
            this.triggerChange();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.contentArea.innerHTML = this.history[this.historyIndex];
            this.triggerChange();
        }
    }

    updateToolbarState() {
        const self = this;

        this.toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
            const command = btn.getAttribute('data-command');
            if (command && self.toolbarButtons[command] && self.toolbarButtons[command].command) {
                try {
                    const isActive = document.queryCommandState(self.toolbarButtons[command].command);
                    btn.classList.toggle('active', isActive);
                } catch (e) {
                    // Supported check fails gracefully
                }
            }
        });

        // Update font family dropdown to reflect current selection
        try {
            const currentFont = document.queryCommandValue('fontName');
            if (currentFont) {
                // Replaced $.find() with querySelector()
                const fontSelect = this.toolbar.querySelector('select[data-command="fontname"]');
                if (fontSelect) {
                    // Clean up the font name (remove quotes and extra formatting)
                    let cleanFont = currentFont.replace(/['"]/g, '').trim();
                    
                    // Try to find exact match first
                    let matchFound = false;
                    
                    // Replaced fontSelect.find('option').each() with querySelectorAll() and for...of
                    const options = fontSelect.querySelectorAll('option');
                    for (const option of options) {
                        const optionValue = option.value; // Replaced $(this).val()
                        if (optionValue) {
                            // Check if the option value matches or contains the current font
                            const optionFonts = optionValue.split(',').map(f => f.trim().replace(/['"]/g, ''));
                            if (optionFonts.some(font => font.toLowerCase() === cleanFont.toLowerCase())) {
                                fontSelect.value = optionValue; // Replaced fontSelect.val()
                                matchFound = true;
                                break; // Replaced return false; to break the loop
                            }
                        }
                    }
                    
                    // If no match found, reset to default
                    if (!matchFound) {
                        fontSelect.value = ''; // Replaced fontSelect.val('')
                    }
                }
            }
        } catch (e) {
            // queryCommandValue may fail in some browsers
        }


        try {
            const currentSize = document.queryCommandValue('fontSize');
            if (currentSize) {
                const sizeSelect = this.toolbar.querySelector('select[data-command="fontsize"]');
                if (sizeSelect) sizeSelect.value = currentSize;
            }
        } catch (e) { }

        this.updateColorIndicators();
    }

    updateColorIndicators() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        let element = selection.anchorNode;
        if (element.nodeType === 3) {
            element = element.parentElement;
        }

        const computedStyle = window.getComputedStyle(element);
        const foregroundColor = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;

        const rgbToHex = (rgb) => {
            if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') {
                return null;
            }
            const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
            if (!match) return null;

            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);

            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        };

        const foregroundBtn = this.toolbar.querySelector('.color-picker-btn[data-color-command="foreColor"]');
        if (foregroundBtn && foregroundColor) {
            const hexColor = rgbToHex(foregroundColor);
            if (hexColor) {
                foregroundBtn.style.setProperty('--indicator-color', hexColor);
                foregroundBtn.setAttribute('data-current-color', hexColor);
            }
        }

        const backgroundBtn = this.toolbar.querySelector('.color-picker-btn[data-color-command="backColor"]');
        if (backgroundBtn) {
            const hexColor = rgbToHex(backgroundColor);
            if (hexColor && hexColor !== '#ffffff' && backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                backgroundBtn.style.setProperty('--indicator-color', hexColor);
                backgroundBtn.setAttribute('data-current-color', hexColor);
            } else {
                backgroundBtn.style.setProperty('--indicator-color', '#ffeb3b');
                backgroundBtn.removeAttribute('data-current-color');
            }
        }
    }

    updateStatusBar() {
        if (!this.options.showStatusBar) return;

        const text = this.contentArea.innerText || this.contentArea.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = text.length;

        const wordLabel = (this.lang && this.lang.statusBar) ?
            (words !== 1 ? this.lang.statusBar.words : this.lang.statusBar.word) :
            (words !== 1 ? 'words' : 'word');

        const charLabel = (this.lang && this.lang.statusBar) ?
            (chars !== 1 ? this.lang.statusBar.characters : this.lang.statusBar.character) :
            (chars !== 1 ? 'characters' : 'character');

        this.statusBar.querySelector('.word-count').innerText = `${words} ${wordLabel}`;
        this.statusBar.querySelector('.char-count').innerText = `${chars} ${charLabel}`;
    }

    toggleCodeView() {
        this.isCodeView = !this.isCodeView;

        if (this.isCodeView) {
            let html = this.contentArea.innerHTML;
            // html = this.formatHtmlForCodeView(html);
            this.codeArea.value = html;
            this.wrapper.classList.add('code-view');
        } else {
            this.contentArea.innerHTML = this.codeArea.value;
            this.wrapper.classList.remove('code-view');
        }

        const codeBtn = this.toolbar.querySelector('[data-command="codeView"]');
        if (codeBtn) codeBtn.classList.toggle('active', this.isCodeView);
    }

    formatHtmlForCodeView(html) {
        const lines = html.split('');
        let minIndent = Infinity;
        lines.forEach(line => {
            if (line.trim().length > 0) {
                const indent = line.match(/^\s*/)[0].length;
                minIndent = Math.min(minIndent, indent);
            }
        });

        if (minIndent > 0 && minIndent !== Infinity) {
            return lines.map(line => {
                if (line.trim().length > 0) {
                    return line.substring(minIndent);
                }
                return line;
            }).join('');
        }

        return html;
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.wrapper.classList.toggle('fullscreen', this.isFullscreen);

        const icon = this.toolbar.querySelector('[data-command="fullscreen"] i');
        if (icon) {
            icon.classList.toggle('bi-arrows-fullscreen', !this.isFullscreen);
            icon.classList.toggle('bi-fullscreen-exit', this.isFullscreen);
        }

        const fsBtn = this.toolbar.querySelector('[data-command="fullscreen"]');
        if (fsBtn) fsBtn.classList.toggle('active', this.isFullscreen);
    }

    setDirection(direction, mode) {
        mode = mode || 'inline';

        if (mode === 'block') {
            const selection = window.getSelection();

            if (selection && !selection.isCollapsed) {
                let node = selection.anchorNode;
                while (node && node !== this.contentArea) {
                    if (node.nodeType === 1 && ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'].includes(node.nodeName)) {
                        node.style.direction = direction;
                        node.style.textAlign = direction === 'rtl' ? 'right' : 'left';
                        break;
                    }
                    node = node.parentNode;
                }

                if (!node || node === this.contentArea) {
                    const range = selection.getRangeAt(0);
                    const div = document.createElement('div');
                    div.style.direction = direction;
                    div.style.textAlign = direction === 'rtl' ? 'right' : 'left';
                    range.surroundContents(div);
                }
            } else {
                this.contentArea.style.direction = direction;
                this.contentArea.style.textAlign = direction === 'rtl' ? 'right' : 'left';
            }
        } else {
            const selection = window.getSelection();

            if (selection && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                span.style.direction = direction;
                span.style.display = 'inline-block';
                span.style.textAlign = direction === 'rtl' ? 'right' : 'left';
                range.surroundContents(span);
            } else {
                this.contentArea.style.direction = direction;
                this.contentArea.style.textAlign = direction === 'rtl' ? 'right' : 'left';
            }
        }

        this.updateHistory();
    }

    showAlert(type, message, title, lang) {
        const modalId = 'editorAlertModal' + Date.now();

        if (!title && lang && lang.messages) {
            title = lang.messages.info;
            if (type === 'success') title = lang.messages.success;
            if (type === 'error') title = lang.messages.error;
        }

        let icon = 'bi-info-circle';
        let iconColor = 'text-info';
        if (type === 'success') {
            icon = 'bi-check-circle';
            iconColor = 'text-success';
        } else if (type === 'error') {
            icon = 'bi-x-circle';
            iconColor = 'text-danger';
        }

        const modalHtml = `
            <div class="modal" id="${modalId}" tabindex="-1" aria-hidden="true" style="z-index: 10500 !important; display: block;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content slate-canvas-modal-content">
                        <div class="modal-header slate-canvas-modal-header" style="flex-direction: row-reverse;">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="margin: 0;"></button>
                            <h5 class="modal-title" style="flex: 1;"><i class="bi ${icon} ${iconColor}"></i> ${title}</h5>
                        </div>
                        <div class="modal-body slate-canvas-modal-body">
                            ${message}
                        </div>
                        <div class="modal-footer slate-canvas-modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${(lang && lang.messages && lang.messages.ok) || 'OK'}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const backdropId = 'editorAlertBackdrop' + Date.now();
        const backdropHtml = `<div id="${backdropId}" class="modal-backdrop" style="z-index: 10400 !important; opacity: 0.5 !important; display: block !important;"></div>`;
        document.body.insertAdjacentHTML('beforeend', backdropHtml);

        const modalElement = document.getElementById(modalId);
        const modal = new bootstrap.Modal(modalElement, {
            backdrop: false,
            keyboard: true
        });

        modal.show();

        modalElement.addEventListener('hidden.bs.modal', function () {
            modalElement.remove();
            const bDrop = document.getElementById(backdropId);
            if (bDrop) bDrop.remove();
        });
    }

    showLinkModal() {
        this.saveSelection();

        const selection = window.getSelection();
        const selectedText = selection.toString();

        document.getElementById('linkText').value = selectedText ? selectedText : '';
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkNewTab').checked = true;

        document.getElementById('linkModal').classList.add('show');
        document.getElementById('linkUrl').focus();
    }

    insertLink() {
        const text = document.getElementById('linkText').value;
        const url = document.getElementById('linkUrl').value;
        const newTab = document.getElementById('linkNewTab').checked;

        if (!url) {
            const msg = (this.lang && this.lang.messages && this.lang.messages.enterUrl) || 'Please enter a URL';
            this.showAlert('error', msg, null, this.lang);
            return;
        }

        document.getElementById('linkModal').classList.remove('show');

        setTimeout(() => {
            this.contentArea.focus();
            this.restoreSelection();

            const linkHtml = `<a href="${url}"${newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text || url}</a>`;
            document.execCommand('insertHTML', false, linkHtml);
            this.updateHistory();

            this.contentArea.focus();
        }, 50);
    }

    showImageModal() {
        this.saveSelection();

        document.getElementById('imageUrl').value = '';
        document.getElementById('imageAlt').value = '';
        document.getElementById('imageWidth').value = '';
        document.getElementById('imageModal').classList.add('show');
        document.getElementById('imageUrl').focus();
    }

    insertImage() {
        const url = document.getElementById('imageUrl').value;
        const alt = document.getElementById('imageAlt').value;
        const width = document.getElementById('imageWidth').value;

        if (!url) {
            const msg = (this.lang && this.lang.messages && this.lang.messages.enterImageUrl) || 'Please enter an image URL';
            this.showAlert('error', msg, null, this.lang);
            return;
        }

        let imageHtml = `<img src="${url}" alt="${alt || ''}"`;
        if (width) {
            imageHtml += ` style="width: ${width}"`;
        }
        imageHtml += '>';

        document.getElementById('imageModal').classList.remove('show');

        setTimeout(() => {
            this.contentArea.focus();
            this.restoreSelection();

            document.execCommand('insertHTML', false, imageHtml);
            this.updateHistory();

            this.contentArea.focus();
        }, 50);
    }

    showTableModal() {
        this.saveSelection();
        document.getElementById('tableModal').classList.add('show');
    }

    insertTable() {
        const rows = this.selectedTableRows || 2;
        const cols = this.selectedTableCols || 2;

        let tableHtml = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';

        for (let i = 0; i < rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < cols; j++) {
                if (i === 0) {
                    tableHtml += '<th>Header</th>';
                } else {
                    tableHtml += '<td>Cell</td>';
                }
            }
            tableHtml += '</tr>';
        }

        tableHtml += '</table><p>&nbsp;</p>';

        document.getElementById('tableModal').classList.remove('show');

        this.selectedTableRows = null;
        this.selectedTableCols = null;

        setTimeout(() => {
            this.contentArea.focus();
            this.restoreSelection();

            document.execCommand('insertHTML', false, tableHtml);
            this.updateHistory();

            this.contentArea.focus();
        }, 50);
    }

    triggerChange() {
        const content = this.isCodeView ? this.codeArea.value : this.contentArea.innerHTML;
        this.element.value = content;

        if (this.options.onChange) {
            this.options.onChange.call(this, content);
        }

        const changeEvent = new CustomEvent('slate:change', {
            detail: { content: content },
            bubbles: true
        });
        this.element.dispatchEvent(changeEvent);
    }

    // Public methods
    getContent() {
        return this.isCodeView ? this.codeArea.value : this.contentArea.innerHTML;
    }

    setContent(html) {
        this.contentArea.innerHTML = html;
        this.codeArea.value = html;
        this.updateHistory();
        this.updateStatusBar();
        this.triggerChange();
    }

    getText() {
        return this.contentArea.innerText || this.contentArea.textContent || '';
    }

    clear() {
        this.setContent('');
    }

    focus() {
        if (this.isCodeView) {
            this.codeArea.focus();
        } else {
            this.contentArea.focus();
        }
    }

    disable() {
        this.contentArea.setAttribute('contenteditable', 'false');
        this.codeArea.disabled = true;
        this.wrapper.classList.add('disabled');
    }

    enable() {
        this.contentArea.setAttribute('contenteditable', 'true');
        this.codeArea.disabled = false;
        this.wrapper.classList.remove('disabled');
    }

    destroy() {
        this.wrapper.remove();
        document.querySelectorAll('.slate-canvas-modal').forEach(m => m.remove());
        this.element.style.display = '';
    }
}

if (typeof window !== 'undefined') {
    window.Slate = Slate;
}
