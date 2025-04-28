import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';

// Define types for form states
interface LoginFormState {
  username: string;
  password: string;
}

interface RegisterFormState {
  username: string;
  password: string;
}

// API response types
interface AuthResponse {
  message: string;
  userId?: string;
  detail?: string;
}

type TabType = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    username: '',
    password: ''
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    username: '',
    password: ''
  });
  
  // Handle login form change
  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle register form change
  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };
  
  // Handle login submission
  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });
      
      const data: AuthResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      // Store user ID in localStorage
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        throw new Error('User ID not received from server');
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle registration submission
  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate password strength (optional)
    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerForm.username,
          password: registerForm.password,
        }),
      });
      
      const data: AuthResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      // Success - switch to login tab
      setActiveTab('login');
      setLoginForm({
        ...loginForm,
        username: registerForm.username,
        password: ''
      });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left side - Background image section */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-90 ml-2 my-2">
          {/* Replace with your actual cover image import */}
          <img 
            src="https://www.freevector.com/uploads/vector/preview/85990/vecteezyseamless-geometric-seamless_background-3-HS1122_generated.jpg"
            alt="Abstract design"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-end mb-8">
            <div className="text-xl sm:text-2xl font-bold text-[#0B60B0] flex items-center">
              <Zap className="mr-2" />
              uply
            </div>
          </div>
          
          {activeTab === 'login' ? (
            <div>
              <h2 className="text-3xl font-semibold mb-8">Welcome Back</h2>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Email</Label>
                  <Input 
                    id="username" 
                    name="username"
                    type="email"
                    placeholder="Enter your email" 
                    className="h-12 border-black"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password" 
                      className="h-12 border-black"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#0B60B0] hover:bg-[#0B60B0]/80 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              <div className="mt-8 flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-500">Don't have an account?</span>
                <button 
                  onClick={() => setActiveTab('register')}
                  className="text-sm font-semibold text-[#0B60B0]"
                  type="button"
                >
                  Sign up
                </button>
              </div>
              
              <div className="mt-12 flex justify-center">
                <Button className="w-full h-12 bg-[#0B60B0] hover:bg-[#0B60B0]/80 text-white">
                  <img src="https://cdn.freebiesupply.com/logos/large/2x/google-icon-logo-black-and-white.png" alt="Google" className="h-5 w-5 mr-2" />
                  Sign in with Google
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-semibold mb-8">Create Account</h2>
              
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Email</Label>
                  <Input 
                    id="register-username"
                    name="username"
                    type="email"
                    placeholder="Enter your email" 
                    className="h-12 border-black"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="register-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password" 
                      className="h-12 border-black"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                

                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#0B60B0] hover:bg-[#0B60B0]/80 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account</>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
              
              <div className="mt-8 flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-500">Already have an account?</span>
                <button 
                  onClick={() => setActiveTab('login')}
                  className="text-sm font-semibold text-[#0B60B0]"
                  type="button"
                >
                  Sign in
                </button>
              </div>
              
              <div className="mt-12 flex justify-center">
                <Button className="w-full h-12 bg-[#0B60B0] hover:bg-[#0B60B0]/80 text-white">
                  <img src="https://cdn.freebiesupply.com/logos/large/2x/google-icon-logo-black-and-white.png" alt="Google" className="h-5 w-5 mr-2" />
                  Sign up with Google
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;