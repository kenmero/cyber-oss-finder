import { Octokit } from "octokit";

export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    language: string | null;
    license: {
        key: string;
        name: string;
        spdx_id: string | null;
        url: string | null;
    } | null;
    topics: string[];
}

export interface LicenseAnalysis {
    status: 'allowed' | 'review' | 'forbidden' | 'unknown';
    label: string;
    color: string;
    description: string;
    accessType: 'GRANTED' | 'AUDIT_REQ' | 'RESTRICTED' | 'UNKNOWN';
}

// Default technical term dictionary
const DEFAULT_DICTIONARY: Record<string, string> = {
    "画像認識": "image recognition",
    "監視": "monitoring",
    "分析": "analytics",
    "フレームワーク": "framework",
    "推論": "inference",
    "学習": "learning",
    "自動化": "automation",
    "セキュリティ": "security",
    "ネットワーク": "network",
    "データベース": "database",
};

export const getCustomDictionary = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try {
        const stored = localStorage.getItem('custom_dictionary');
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error("Failed to load custom dictionary", e);
        return {};
    }
};

export const saveCustomDictionary = (dict: Record<string, string>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('custom_dictionary', JSON.stringify(dict));
};

export const translateQuery = (query: string): string => {
    const customDict = getCustomDictionary();
    const mergedDict = { ...DEFAULT_DICTIONARY, ...customDict };

    let translated = query;
    Object.entries(mergedDict).forEach(([jp, en]) => {
        translated = translated.replace(new RegExp(jp, 'g'), en);
    });

    return translated;
};

export const analyzeLicense = (licenseKey?: string): LicenseAnalysis => {
    if (!licenseKey) {
        return {
            status: 'unknown',
            label: 'NO LICENSE',
            color: 'text-gray-500',
            description: 'Copyright laws apply. Risky.',
            accessType: 'UNKNOWN'
        };
    }

    const key = licenseKey.toLowerCase();

    // Permissive (Commercial OK)
    if (['mit', 'apache-2.0', 'bsd-3-clause', 'bsd-2-clause', 'isc', 'unlicense', 'wtfpl', 'cc0-1.0', 'zlib'].includes(key)) {
        return {
            status: 'allowed',
            label: 'COMMERCIAL OK',
            color: 'text-neon-green',
            description: 'Permissive license. Safe for commercial use.',
            accessType: 'GRANTED'
        };
    }

    // Copyleft (Viral - Require source disclosure)
    if (['gpl-3.0', 'gpl-2.0', 'agpl-3.0', 'lgpl-3.0', 'lgpl-2.1', 'mpl-2.0', 'epl-2.0'].includes(key)) {
        return {
            status: 'review',
            label: 'VIRAL / COPYLEFT',
            color: 'text-neon-cyan',
            description: 'Commercial use allowed, but source code must be disclosed if distributed.',
            accessType: 'AUDIT_REQ'
        };
    }

    // Non-Commercial
    if (key.includes('nc') || key.includes('non-commercial') || key.includes('cc-by-nc')) {
        return {
            status: 'forbidden',
            label: 'NON-COMMERCIAL',
            color: 'text-red-500',
            description: 'Commercial use is strictly prohibited.',
            accessType: 'RESTRICTED'
        };
    }

    return {
        status: 'unknown',
        label: 'UNKNOWN LICENSE',
        color: 'text-yellow-500',
        description: 'Check license terms manually.',
        accessType: 'UNKNOWN'
    };
};

export const searchRepositories = async (query: string, limit: number = 5): Promise<GithubRepo[]> => {
    if (!query) return [];

    try {
        // Use GitHub token if available, otherwise use unauthenticated (60 req/hour limit)
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN || undefined
        });

        // Translate query using dictionary
        const translatedQuery = translateQuery(query);
        console.log(`Searching for: ${translatedQuery} (Original: ${query})`);

        const q = `${translatedQuery} stars:>10 forks:>5`;
        const response = await octokit.request("GET /search/repositories", {
            q,
            sort: "stars",
            order: "desc",
            per_page: limit,
        });

        return response.data.items as unknown as GithubRepo[];
    } catch (error) {
        console.error("GitHub API Error in searchRepositories:", error);
        // Log specific details if available
        if (typeof error === 'object' && error !== null && 'status' in error) {
            console.error(`Status: ${(error as any).status}`);
        }
        return [];
    }
};
