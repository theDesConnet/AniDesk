import { writable } from "svelte/store";
import { localStorageWritable } from "@babichjacob/svelte-localstorage";
import utils from "../../utils";

export const pageHistory = writable([]);

export const playerSettingsStore = localStorageWritable(
    "playerSettings",
    utils.playerDefaultSettings,
);
