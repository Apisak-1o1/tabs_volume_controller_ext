

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ audible: true }, (tabs) => {
        const container = document.getElementById('tabList');
        container.innerHTML = '';

        tabs.forEach(tab => {
            const block = document.createElement('div');
            block.className = 'tab-block';

            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = tab.title;

            const controls = document.createElement('div');
            controls.className = 'controls';

            const muteBtn = document.createElement('button');
            muteBtn.innerHTML = tab.mutedInfo.muted
                ? '<span class="material-symbols-outlined">volume_off</span>'
                : '<span class="material-symbols-outlined">volume_up</span>';

            muteBtn.onclick = () => {
                chrome.tabs.get(tab.id, (latestTab) => {
                    const newMuted = !latestTab.mutedInfo.muted;
                    chrome.tabs.update(tab.id, { muted: newMuted }, (updatedTab) => {
                        muteBtn.innerHTML = updatedTab.mutedInfo.muted
                            ? '<span class="material-symbols-outlined">volume_off</span>'
                            : '<span class="material-symbols-outlined">volume_up</span>';
                    });
                });
            };


            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = 0;
            slider.max = 1;
            slider.step = 0.01;
            slider.value = 1;
            slider.className = 'volume-slider';
            slider.dataset.tab = tab.id;

            slider.addEventListener('input', e => {
                const volume = parseFloat(e.target.value);
                const tabId = parseInt(e.target.dataset.tab);
                chrome.runtime.sendMessage({
                    action: "setVolume",
                    tabId: tabId,
                    volume: volume
                });
                if (volume === 0){
                muteBtn.innerHTML = '<span class="material-symbols-outlined">volume_off</span>'
                } else {
                    muteBtn.innerHTML = '<span class="material-symbols-outlined">volume_up</span>'
                }
            });

            controls.appendChild(muteBtn);
            controls.appendChild(slider);
            block.appendChild(title);
            block.appendChild(controls);
            container.appendChild(block);
        });

        if (tabs.length === 0) {
            container.innerHTML = '<p>No audio tabs currently active.</p>';
        }
    });
});
