/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as semver from 'semver';
import { IActionContext } from 'vscode-azureextensionui';
import { ext } from '../extensionVariables';
import { callDockerodeWithErrorHandling } from './callDockerodeWithErrorHandling';

// Minimum Windows RS3 version number
const windows10RS3MinVersion = '10.0.16299';

// Minimum Windows RS4 version number
const windows10RS4MinVersion = '10.0.17134';

// Minimum Windows RS5 version number
const windows10RS5MinVersion = "10.0.17763";

// Minimum Windows 19H1 version number
const windows1019H1MinVersion = "10.0.18362";

export function isWindows(): boolean {
    return ext.os.platform === 'win32';
}

export function isWindows1019H1OrNewer(): boolean {
    if (!isWindows()) {
        return false;
    }

    return semver.gte(ext.os.release, windows1019H1MinVersion);
}

export function isWindows10RS5OrNewer(): boolean {
    if (!isWindows()) {
        return false;
    }

    return semver.gte(ext.os.release, windows10RS5MinVersion);
}

export function isWindows10RS4OrNewer(): boolean {
    if (!isWindows()) {
        return false;
    }

    return semver.gte(ext.os.release, windows10RS4MinVersion);
}

export function isWindows10RS3OrNewer(): boolean {
    if (!isWindows()) {
        return false;
    }

    return semver.gte(ext.os.release, windows10RS3MinVersion);
}

export function isLinux(): boolean {
    return !isMac() && !isWindows();
}

export function isMac(): boolean {
    return ext.os.platform === 'darwin';
}

export type DockerOSType = "windows" | "linux";

export async function getDockerOSType(context: IActionContext): Promise<DockerOSType> {
    if (!isWindows()) {
        // On Linux or macOS, this can only ever be linux,
        // so short-circuit the Docker call entirely.
        return "linux";
    } else {
        /* eslint-disable-next-line @typescript-eslint/promise-function-async */
        const info = await callDockerodeWithErrorHandling(() => ext.dockerode.info(), context);
        // eslint-disable-next-line @typescript-eslint/tslint/config
        return info.OSType;
    }
}
