/* chat-badge.js — Live unread message count badge for EntranceHearts
 * Requires supabaseClient to be defined before this script loads.
 * Reads: messages table (to_user, seen columns)
 * Updates: all .chat-unread-badge elements on the page
 */
(function initChatBadge() {
  'use strict';

  var currentUserId = null;
  var realtimeChannel = null;

  async function getUnreadCount() {
    if (!currentUserId) return 0;
    try {
      var result = await supabaseClient
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('to_user', currentUserId)
        .eq('seen', false);
      return result.count || 0;
    } catch (e) { return 0; }
  }

  function renderBadges(n) {
    document.querySelectorAll('.chat-unread-badge').forEach(function(el) {
      if (n > 0) {
        el.textContent = n > 99 ? '99+' : String(n);
        el.style.display = '';
        el.setAttribute('aria-label', n + ' unread messages');
      } else {
        el.style.display = 'none';
      }
    });
    if (n > 0) {
      localStorage.setItem('eh_unread_chat', String(n));
    } else {
      localStorage.removeItem('eh_unread_chat');
    }
  }

  async function refresh() {
    var n = await getUnreadCount();
    renderBadges(n);
  }

  async function refreshLikesBadge() {
    if (!currentUserId) return;
    try {
      var result = await supabaseClient
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('to_user', currentUserId);
      var total = result.count || 0;
      var seen = parseInt(localStorage.getItem('eh_likes_seen_count') || '0', 10);
      var newLikes = Math.max(0, total - seen);
      document.querySelectorAll('.likes-new-badge').forEach(function(el) {
        if (newLikes > 0) {
          el.textContent = newLikes > 99 ? '99+' : String(newLikes);
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      });
      if (newLikes > 0) localStorage.setItem('eh_new_likes', String(newLikes));
      else localStorage.removeItem('eh_new_likes');
    } catch(e) {}
  }

  async function init() {
    try {
      var authResult = await supabaseClient.auth.getUser();
      var user = authResult.data && authResult.data.user;
      if (!user) return;
      currentUserId = user.id;

      // Show cached count immediately while we fetch real count
      var cached = parseInt(localStorage.getItem('eh_unread_chat') || '0', 10);
      if (cached > 0) renderBadges(cached);

      await refresh();
      await refreshLikesBadge();

      // Subscribe to new incoming messages
      realtimeChannel = supabaseClient
        .channel('chat-badge-' + user.id)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'to_user=eq.' + user.id
        }, async function(payload) {
          await refresh();
          // Fire push notification for new chat message
          if ('Notification' in window && Notification.permission === 'granted' && payload.new) {
            try {
              var body = payload.new.is_voice
                ? '🎤 Voice message received'
                : (payload.new.text || 'New message').slice(0, 80);
              new Notification('💬 New Message — EntranceHearts', {
                body: body,
                icon: 'icon-192.png',
                tag: 'eh-chat-msg',
                renotify: true
              });
            } catch (e) {}
          }
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: 'to_user=eq.' + user.id
        }, function() { refresh(); })
        .subscribe();

    } catch (e) {
      // Not logged in or network error — badges stay hidden
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded already fired
    init();
  }
})();
