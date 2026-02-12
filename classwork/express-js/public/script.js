// Sample video data
const videos = [
    {
        id: 1,
        title: 'Web Development Tutorial - Build a Complete Website',
        channel: 'Tech Tutorials',
        views: '2.5M',
        uploadDate: '2 weeks ago',
        duration: '45:30',
        thumbnail: 'https://via.placeholder.com/320x180?text=Web+Development',
        channelAvatar: 'https://via.placeholder.com/48x48?text=TT',
        description: 'In this comprehensive tutorial, learn how to build a complete website from scratch using HTML, CSS, and JavaScript. We cover everything from basic structure to advanced styling and interactivity.'
    },
    {
        id: 2,
        title: 'JavaScript ES6 Features Explained',
        channel: 'Code Masters',
        views: '1.8M',
        uploadDate: '1 week ago',
        duration: '38:15',
        thumbnail: 'https://via.placeholder.com/320x180?text=JavaScript+ES6',
        channelAvatar: 'https://via.placeholder.com/48x48?text=CM',
        description: 'Learn about the most important ES6 features including arrow functions, destructuring, classes, promises, and async/await. Perfect for intermediate to advanced developers.'
    },
    {
        id: 3,
        title: 'React.js Complete Guide for Beginners',
        channel: 'Frontend Dev',
        views: '3.2M',
        uploadDate: '3 weeks ago',
        duration: '52:45',
        thumbnail: 'https://via.placeholder.com/320x180?text=React+Guide',
        channelAvatar: 'https://via.placeholder.com/48x48?text=FD',
        description: 'Start your React journey with this complete beginner guide. Learn about components, hooks, state management, and how to build modern web applications.'
    },
    {
        id: 4,
        title: 'CSS Grid & Flexbox Mastery',
        channel: 'Design Basics',
        views: '980K',
        uploadDate: '4 days ago',
        duration: '28:20',
        thumbnail: 'https://via.placeholder.com/320x180?text=CSS+Grid',
        channelAvatar: 'https://via.placeholder.com/48x48?text=DB',
        description: 'Master CSS Grid and Flexbox in this detailed tutorial. Learn how to create responsive layouts that work on all devices.'
    },
    {
        id: 5,
        title: 'Node.js Backend Development',
        channel: 'Backend Pro',
        views: '2.1M',
        uploadDate: '5 days ago',
        duration: '61:30',
        thumbnail: 'https://via.placeholder.com/320x180?text=Node.js',
        channelAvatar: 'https://via.placeholder.com/48x48?text=BP',
        description: 'Build scalable backend applications with Node.js. Learn about Express, databases, authentication, and deployment.'
    },
    {
        id: 6,
        title: 'Database Design with SQL',
        channel: 'Data Academy',
        views: '1.5M',
        uploadDate: '1 week ago',
        duration: '44:10',
        thumbnail: 'https://via.placeholder.com/320x180?text=SQL+Database',
        channelAvatar: 'https://via.placeholder.com/48x48?text=DA',
        description: 'Learn database design principles and master SQL. Create efficient queries and optimize your database performance.'
    },
    {
        id: 7,
        title: 'Git and GitHub Complete Tutorial',
        channel: 'Dev Tools',
        views: '890K',
        uploadDate: '2 weeks ago',
        duration: '35:50',
        thumbnail: 'https://via.placeholder.com/320x180?text=Git+GitHub',
        channelAvatar: 'https://via.placeholder.com/48x48?text=DT',
        description: 'Master version control with Git and GitHub. Learn branching, merging, pull requests, and collaboration workflows.'
    },
    {
        id: 8,
        title: 'Web Performance Optimization',
        channel: 'Performance Tips',
        views: '1.2M',
        uploadDate: '10 days ago',
        duration: '39:25',
        thumbnail: 'https://via.placeholder.com/320x180?text=Performance',
        channelAvatar: 'https://via.placeholder.com/48x48?text=PT',
        description: 'Optimize your website for speed and performance. Learn about caching, compression, lazy loading, and best practices.'
    }
];

// DOM Elements
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const videosContainer = document.getElementById('videosContainer');
const videoModal = document.getElementById('videoModal');
const closeBtn = document.querySelector('.close-btn');
const mainContainer = document.querySelector('.main-container');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const navItems = document.querySelectorAll('.nav-item');

// Toggle Sidebar
hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContainer.classList.toggle('expanded');
});

// Render Videos
function renderVideos(videosToRender = videos) {
    videosContainer.innerHTML = '';
    
    if (videosToRender.length === 0) {
        videosContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa;">No videos found</p>';
        return;
    }

    videosToRender.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <img src="${video.channelAvatar}" class="channel-avatar" alt="${video.channel}">
                <div class="video-details">
                    <div class="video-title">${video.title}</div>
                    <div class="video-channel">${video.channel}</div>
                    <div class="video-stats">${video.views} views • ${video.uploadDate}</div>
                </div>
            </div>
        `;
        
        videoCard.addEventListener('click', () => openModal(video));
        videosContainer.appendChild(videoCard);
    });
}

// Open Modal
function openModal(video) {
    document.getElementById('modalVideo').src = `https://via.placeholder.com/900x506?text=${encodeURIComponent(video.title)}`;
    document.getElementById('modalTitle').textContent = video.title;
    document.getElementById('channelName').textContent = video.channel;
    document.getElementById('channelImg').src = video.channelAvatar;
    document.getElementById('views').textContent = `${video.views} views`;
    document.getElementById('uploadDate').textContent = video.uploadDate;
    document.getElementById('videoDesc').textContent = video.description;
    
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeModal);

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeModal();
    }
});

// Search Videos
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredVideos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.channel.toLowerCase().includes(searchTerm)
    );
    renderVideos(filteredVideos);
});

// Category Filter
categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // For demo, just re-render all videos
        // In a real app, you'd filter by category
        renderVideos(videos);
    });
});

// Navigation Items
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Subscribe button
const subscribeBtn = document.querySelector('.subscribe-btn');
if (subscribeBtn) {
    subscribeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        alert('You subscribed to this channel!');
    });
}

// Initial render
renderVideos();

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeModal();
    }
});
