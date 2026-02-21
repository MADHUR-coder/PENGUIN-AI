import type { IRTItem } from './questionBank';
import { QUESTION_BANK, DOMAINS } from './questionBank';

/**
 * Client-side 2PL IRT Adaptive Engine
 * Implements Computerized Adaptive Testing (CAT) with Maximum Fisher Information item selection.
 */

/** Probability of correct response given theta (ability) and item parameters */
export function probability(theta: number, item: IRTItem): number {
    return 1.0 / (1.0 + Math.exp(-item.discrimination * (theta - item.difficulty)));
}

/** Fisher Information for an item at a given theta */
export function fisherInformation(theta: number, item: IRTItem): number {
    const p = probability(theta, item);
    const q = 1.0 - p;
    return item.discrimination * item.discrimination * p * q;
}

/** Select the next item with maximum Fisher Information at current ability estimate */
export function selectNextItem(
    thetaHat: number,
    answeredIds: Set<string>,
    domainId?: string
): IRTItem | null {
    let bestItem: IRTItem | null = null;
    let maxInfo = -1;

    const candidates = QUESTION_BANK.filter(
        (item) => !answeredIds.has(item.id) && (!domainId || item.domainId === domainId)
    );

    for (const item of candidates) {
        const info = fisherInformation(thetaHat, item);
        if (info > maxInfo) {
            maxInfo = info;
            bestItem = item;
        }
    }

    return bestItem;
}

/** Select next item for calibration — cycles through domains */
export function selectNextCalibrationItem(
    domainThetas: Record<string, number>,
    answeredIds: Set<string>,
    questionCount: number
): IRTItem | null {
    const domainOrder = DOMAINS.map((d) => d.id);
    const domainIndex = questionCount % domainOrder.length;
    const targetDomain = domainOrder[domainIndex];
    const theta = domainThetas[targetDomain] ?? 0;

    // Try target domain first, fall back to any domain
    let item = selectNextItem(theta, answeredIds, targetDomain);
    if (!item) {
        item = selectNextItem(0, answeredIds);
    }
    return item;
}

/**
 * Maximum Likelihood Estimation of ability (theta) after responses.
 * Uses a simple iterative Newton-Raphson-like approach (client-side approximation).
 */
export function estimateAbility(
    responses: { item: IRTItem; correct: boolean }[]
): number {
    if (responses.length === 0) return 0;

    let theta = 0; // start at midpoint

    // Newton-Raphson iterations
    for (let iter = 0; iter < 25; iter++) {
        let dLL = 0;  // derivative of log-likelihood
        let d2LL = 0; // second derivative

        for (const { item, correct } of responses) {
            const p = probability(theta, item);
            const w = item.discrimination;
            const residual = (correct ? 1 : 0) - p;

            dLL += w * residual;
            d2LL -= w * w * p * (1 - p);
        }

        if (Math.abs(d2LL) < 1e-10) break;

        const delta = dLL / d2LL;
        theta -= delta;

        // Clamp to valid range
        theta = Math.max(-3, Math.min(3, theta));

        if (Math.abs(delta) < 0.001) break;
    }

    return Math.round(theta * 100) / 100;
}

/** Map IRT theta (-3 to +3) to pentagon level (0 to 100) */
export function thetaToPentagonLevel(theta: number): number {
    const normalized = 1.0 / (1.0 + Math.exp(-1.5 * theta));
    return Math.round(normalized * 1000) / 10;
}

/** Calculate Standard Error of Measurement */
export function calculateSEM(
    theta: number,
    responses: { item: IRTItem; correct: boolean }[]
): number {
    if (responses.length === 0) return 3;

    let totalInfo = 0;
    for (const { item } of responses) {
        totalInfo += fisherInformation(theta, item);
    }

    if (totalInfo <= 0) return 3;
    return 1 / Math.sqrt(totalInfo);
}
