        let player;
        let video;

        // Initialize player
        document.addEventListener('DOMContentLoaded', () => {
            video = document.getElementById('player');
            const playerWrapper = document.querySelector('.player-wrapper');
            
            // Initialize Plyr
            player = new Plyr('#player', {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
                settings: ['captions', 'quality', 'speed'],
                quality: { default: 1080, options: [1080, 720, 480, 360] },
                speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }
            });

            // Loading states
            video.addEventListener('loadstart', () => {
                playerWrapper.classList.add('loading');
            });

            video.addEventListener('canplay', () => {
                playerWrapper.classList.remove('loading');
            });

            video.addEventListener('error', () => {
                playerWrapper.classList.remove('loading');
                showNotification('Error loading video', 'error');
            });

            // Update play button
            player.on('play', () => {
                document.getElementById('play-icon').className = 'fas fa-pause';
                document.getElementById('play-text').textContent = 'Pause';
            });

            player.on('pause', () => {
                document.getElementById('play-icon').className = 'fas fa-play';
                document.getElementById('play-text').textContent = 'Play';
            });

            // Update mute button
            player.on('volumechange', () => {
                const muteIcon = document.getElementById('mute-icon');
                const muteText = document.getElementById('mute-text');
                
                if (player.muted || player.volume === 0) {
                    muteIcon.className = 'fas fa-volume-mute';
                    muteText.textContent = 'Unmute';
                } else {
                    muteIcon.className = 'fas fa-volume-up';
                    muteText.textContent = 'Mute';
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                switch(e.key) {
                    case ' ':
                    case 'k':
                        e.preventDefault();
                        togglePlayPause();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        skipBackward();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        skipForward();
                        break;
                    case 'm':
                        e.preventDefault();
                        toggleMute();
                        break;
                    case 'f':
                        e.preventDefault();
                        toggleFullscreen();
                        break;
                }
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const currentTheme = localStorage.getItem('theme') || 'light';

        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fas fa-sun';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Player controls
        function togglePlayPause() {
            if (player.playing) {
                player.pause();
            } else {
                player.play();
            }
        }

        function skipBackward() {
            player.currentTime = Math.max(0, player.currentTime - 10);
            showNotification('Skipped backward 10 seconds', 'info');
        }

        function skipForward() {
            player.currentTime = Math.min(player.duration, player.currentTime + 10);
            showNotification('Skipped forward 10 seconds', 'info');
        }

        function toggleMute() {
            player.muted = !player.muted;
        }

        function toggleFullscreen() {
            player.fullscreen.toggle();
        }

        // External players
        function mx_player() {
            const url = "{{file_url}}";
            const intent = `intent:${url}#Intent;package=com.mxtech.videoplayer.ad;end`;
            window.location.href = intent;
            
            setTimeout(() => {
                showNotification('If MX Player didn\'t open, please install it from Play Store', 'warning');
            }, 2000);
        }

        function vlc_player() {
            const url = "{{file_url}}";
            window.location.href = `vlc://${url}`;
            
            setTimeout(() => {
                showNotification('If VLC didn\'t open, please install it first', 'warning');
            }, 2000);
        }

        function playit_player() {
            const url = "{{file_url}}";
            const playitUrl = `playit://playerv2/video?url=${encodeURIComponent(url)}`;
            window.location.href = playitUrl;
            
            setTimeout(() => {
                showNotification('If PlayIt didn\'t open, please install it from Play Store', 'warning');
            }, 2000);
        }

        function streamDownload() {
            const url = "{{file_url}}";
            const link = document.createElement('a');
            link.href = url;
            link.download = "{{file_name}}" || 'video.mp4';
            link.click();
            showNotification('Download started', 'success');
        }

        // Notification system
        function showNotification(message, type = 'info') {
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
