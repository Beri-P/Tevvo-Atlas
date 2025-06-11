<template>
  <div class="countries-container">
    <header class="app-header">
      <h1>ATLAS</h1>
      <button @click="handleLogout" class="logout-btn">
        Logout
      </button>
    </header>
    
    <main class="main-content">
      <div class="welcome-message">
        <h2>Welcome to ATLAS!</h2>
        <p>This is where we'll display all the countries. Coming up next...</p>
        
        <div class="placeholder-content">
          <div class="placeholder-card">
            <h3>Countries List</h3>
            <p>Browse countries from around the world</p>
          </div>
          
          <div class="placeholder-card">
            <h3>Search & Filter</h3>
            <p>Find countries by name, capital, or region</p>
          </div>
          
          <div class="placeholder-card">
            <h3>Country Details</h3>
            <p>View detailed information about each country</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { authService } from '@/services/supabase.js'

const router = useRouter()

const handleLogout = async () => {
  try {
    await authService.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Force redirect to login even if logout fails
    router.push('/login')
  }
}
</script>

<style scoped>
.countries-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  color: #333;
  margin: 0;
  font-size: 1.8rem;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
}

.main-content {
  padding: 2rem;
}

.welcome-message {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-message h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-message p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.placeholder-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.placeholder-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.placeholder-card:hover {
  transform: translateY(-5px);
}

.placeholder-card h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.placeholder-card p {
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }
  
  .app-header h1 {
    font-size: 1.5rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .welcome-message h2 {
    font-size: 1.5rem;
  }
  
  .placeholder-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>