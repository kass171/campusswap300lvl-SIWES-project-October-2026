// CampusSwap App.js
// This file connects to Supabase and provides shared functions

// REPLACE THESE WITH YOUR OWN SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: Get badge based on swaps count
function getBadge(count) {
    if (count >= 50) return { icon: '💎', name: 'Platinum' };
    if (count >= 25) return { icon: '🥇', name: 'Gold' };
    if (count >= 10) return { icon: '🥈', name: 'Silver' };
    return { icon: '🥉', name: 'Bronze' };
}

// Helper: Format skills string into tags
function formatSkills(skillsString) {
    if (!skillsString) return '';
    return skillsString
        .split(',')
        .map(s => s.trim())
        .filter(s => s)
        .map(s => `<span class="skill-tag">${s}</span>`)
        .join('');
}

// Helper: Display profiles in a grid
function displayProfiles(profiles, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!profiles || profiles.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">No profiles found. Be the first to join!</p>';
        return;
    }
    
    container.innerHTML = profiles.map(p => {
        const badge = getBadge(p.swaps_count);
        return `
            <div class="profile-card" onclick="window.location.href='profile.html?id=${p.id}'">
                <div class="profile-avatar">${p.name.charAt(0)}</div>
                <h3>${p.name} <span style="font-size:14px;">${badge.icon}</span></h3>
                <p class="profile-meta">${p.level} · ${p.department}</p>
                <div>${formatSkills(p.teach_skills)}</div>
                <p style="font-size:13px;color:#666;margin-top:8px;">
                    <b>Wants:</b> ${p.learn_skills}
                </p>
                <p class="profile-rating">⭐ ${p.rating} · ${p.swaps_count} swaps</p>
            </div>
        `;
    }).join('');
}

// Helper: Update stats on home page
async function updateStats() {
    try {
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        
        const { count: swapCount } = await supabase
            .from('swaps')
            .select('*', { count: 'exact', head: true });
        
        if (document.getElementById('totalUsers')) {
            document.getElementById('totalUsers').textContent = userCount || 0;
        }
        if (document.getElementById('totalSwaps')) {
            document.getElementById('totalSwaps').textContent = swapCount || 0;
        }
    } catch (e) {
        console.log('Stats error:', e);
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
});
