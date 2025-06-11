<template>
    <div class="login-container">
      <div class="login-card">
        <h2>Welcome to ATLAS</h2>
        <p class="subtitle">Sign in to explore countries around the world</p>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              required 
              placeholder="Enter your email"
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              required 
              placeholder="Enter your password"
              :disabled="loading"
            />
          </div>
          
          <button type="submit" :disabled="loading || !email || !password" class="login-btn">
            {{ loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
          </button>
          
          <p class="toggle-mode">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button type="button" @click="toggleMode" class="toggle-btn">
              {{ isSignUp ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </form>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-if="success" class="success-message">
          {{ success }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { authService } from '@/services/supabase.js'
  
  const router = useRouter()
  
  // Form state
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  const success = ref('')
  const isSignUp = ref(false)
  
  const toggleMode = () => {
    isSignUp.value = !isSignUp.value
    error.value = ''
    success.value = ''
  }
  
  const handleSubmit = async () => {
    loading.value = true
    error.value = ''
    success.value = ''
    
    try {
      let result
      if (isSignUp.value) {
        result = await authService.signUp(email.value, password.value)
        if (!result.error) {
          success.value = 'Account created successfully! Please check your email for verification.'
          // Switch to sign in mode
          setTimeout(() => {
            isSignUp.value = false
            success.value = ''
          }, 3000)
        }
      } else {
        result = await authService.signIn(email.value, password.value)
        if (!result.error) {
          router.push('/countries')
        }
      }
      
      if (result.error) {
        error.value = result.error.message
      }
    } catch (err) {
      error.value = 'An unexpected error occurred. Please try again.'
      console.error('Auth error:', err)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }
  
  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 1.8rem;
  }
  
  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }
  
  input {
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  input:focus {
    outline: none;
    border-color: #667eea;
  }
  
  input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  .login-btn {
    padding: 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }
  
  .login-btn:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .toggle-mode {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    margin-top: 1rem;
  }
  
  .toggle-btn {
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
    font-weight: 500;
    text-decoration: underline;
    font-size: 0.9rem;
  }
  
  .toggle-btn:hover {
    color: #764ba2;
  }
  
  .error-message {
    background-color: #fee;
    color: #c33;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-size: 0.9rem;
    text-align: center;
  }
  
  .success-message {
    background-color: #efe;
    color: #363;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-size: 0.9rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    .login-card {
      padding: 1.5rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
  }
  </style>