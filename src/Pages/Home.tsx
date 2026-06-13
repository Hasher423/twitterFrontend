import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock type for a post
interface Post {
  id: string;
  authorName: string;
  author: {
    username: string,
  }
  content: string;
  createdAt: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);


  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setIsCreating(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();

      const newPost = data.post || {
        id: Date.now().toString(),
        author: {
          username:'@me'
        },
        content: postContent,
        createdAt: 'Just now'
      };

      setPosts([newPost, ...posts]);
      setPostContent('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };



  useEffect(() => {

    const getPosts = async (e?: React.FormEvent) => {
      e?.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/getPosts`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });


        const data = await response.json();
        console.log(data)

        if (!response.ok) {
          throw new Error(data.message || 'Invalid email or password.');
        }
        setPosts(data.posts);

      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };


    getPosts();

  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return `Just now`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-black font-['Inter',sans-serif] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800/60 bg-black/80 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Home</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-semibold text-gray-500 hover:text-white transition-colors"
            >
              Profile
            </button>
            <div className="text-xs text-gray-500 tracking-wide uppercase font-semibold">MiniTwitter</div>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Create Post Input (Dummy) */}
        <div className="rounded-xl border border-zinc-800/60 bg-black p-4 shadow-sm mb-8">
          <div className="flex space-x-4">
            {/* <div className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-700" /> */}
            <div className="flex-1">
              <textarea
                className="outline-none w-full resize-none border-none bg-transparent focus:ring-0 text-sm placeholder-gray-500"
                placeholder="What's happening?"
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <div className="flex justify-end pt-2">
                <button
                  onClick={createPost}
                  disabled={isCreating || !postContent.trim()}
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="h-6 w-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-zinc-800/60 bg-black p-4 shadow-sm transition-colors hover:bg-zinc-800 cursor-pointer">
                <div className="flex space-x-3">
                  {/* <div className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-700" /> */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="font-bold text-gray-100 truncate">{post.author?.username}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-200 whitespace-pre-wrap">{post.content}</p>

                    {/* Action Buttons */}
                    <div className="mt-3 flex items-center space-x-6 text-gray-500">
                      <button className="hover:text-white transition-colors flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-xs">Reply</span>
                      </button>
                      <button className="hover:text-white transition-colors flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-xs">Like</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
