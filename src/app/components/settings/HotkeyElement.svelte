<script>
    export let title;
    export let value = [];
    export let onSetHotKey = () => {};

    let captureBtn;
    let captureKeys = false;
    let currentPressed = new Set();
    const maxSequenceLength = 10;

    function hotkeyElementFocus(e) {
        value = [];
        e.srcElement.innerText = "Ожидание нажатия клавиши...";
        captureKeys = true;
    }

    function hotkeyElementBlur(e) {
        e.srcElement.innerText =
            value.length > 0
                ? value.map(formatCode).join(" + ")
                : "Горячая клавиша не установлена...";
        captureKeys = false;
    }

    function hotkeyElementKeyDown(e) {
        e.preventDefault();
        if (!captureKeys) return;

        const keyCode = e.code;

        if (!currentPressed.has(keyCode)) {
            currentPressed.add(keyCode);

            if (
                [
                    "ShiftLeft",
                    "ShiftRight",
                    "ControlLeft",
                    "ControlRight",
                    "AltLeft",
                    "AltRight",
                    "MetaLeft",
                    "MetaRight",
                ].includes(keyCode)
            ) {
                if (!value.includes(keyCode)) value.unshift(keyCode);
            } else if (!value.includes(keyCode)) {
                value.push(keyCode);
            }

            captureBtn.innerText = value.map(formatCode).join(" + ");

            if (value.length >= maxSequenceLength) {
                endCapture();
            }
        }
    }

    function hotkeyElementKeyUp(e) {
        currentPressed.delete(e.code);
        if (captureKeys && currentPressed.size === 0) {
            endCapture();
        }
    }

    function formatCode(code) {
        return code
            .replace("Key", "")
            .replace("Digit", "")
            .replace("Left", " (L)")
            .replace("Right", " (R)")
            .replace("Meta", "Meta")
            .replace("Control", "Ctrl")
            .replace("Alt", "Alt")
            .replace("Shift", "Shift");
    }

    function endCapture() {
        captureKeys = false;
        captureBtn.blur();

        onSetHotKey(value);
    }
</script>

<div class="hotkey-element flex-row">
    <div class="hotkey-info flex-column">
        <span class="hotkey-title">{title}</span>
        <div class="flex-row blank-input">
            <button
                class="hotkey-btn"
                onfocus={hotkeyElementFocus}
                onblur={hotkeyElementBlur}
                onkeydown={hotkeyElementKeyDown}
                onkeyup={hotkeyElementKeyUp}
                bind:this={captureBtn}>{value.length > 0 ? value.map(formatCode).join(" + ") : "Горячая клавиша не установлена..."}</button
            >
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .hotkey-element {
        width: max-content;
        justify-content: space-between;
        margin: 10px auto;
        width: 80%;
        transition: opacity 0.1s ease-in-out;
    }

    .hotkey-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .hotkey-info {
        width: 100%;
    }

    .hotkey-btn {
        height: 40px;
        width: 100%;
        border-radius: 10px;
        background-color: var(--alt-background-color);
        border: 1px solid var(--rate-back-color);
        color: var(--main-text-color);
        text-align: left;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
