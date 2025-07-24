import { supabase } from './supabase'

export const testSupabaseConnection = async () => {
  console.log('🔧 Testing Supabase connection...')
  
  try {
    // Test 1: Check if Supabase client is working
    console.log('1️⃣ Testing Supabase client...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('❌ Auth error:', authError)
      return false
    }
    
    if (!user) {
      console.error('❌ No user found')
      return false
    }
    
    console.log('✅ Auth working, user:', user.email)
    
    // Test 2: Ensure user profile exists (create if needed)
    console.log('2️⃣ Checking/creating user profile...')
    
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      // PGRST116 means "not found", which is ok for new users
      console.error('❌ Profile check error:', profileCheckError)
      console.log('💡 This means you need to run the SQL setup script!')
      return false
    }
    
    if (!existingProfile) {
      console.log('👤 New user detected, creating profile...')
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
        })
      
      if (createError) {
        console.error('❌ Failed to create profile:', createError)
        console.log('💡 This means you need to run the SQL setup script!')
        return false
      }
      
      console.log('✅ User profile created successfully!')
    } else {
      console.log('✅ User profile exists')
    }
    
    // Test 3: Quick test of other tables (just check if they exist)
    console.log('3️⃣ Testing database tables...')
    
    // Just test if we can query pages (should return empty array for new user)
    const { error: pagesError } = await supabase
      .from('pages')
      .select('id')
      .limit(1)
    
    if (pagesError) {
      console.error('❌ Pages table error:', pagesError)
      console.log('💡 This means you need to run the SQL setup script!')
      return false
    }
    
    // Test daily_tasks table
    const { error: tasksError } = await supabase
      .from('daily_tasks')
      .select('id')
      .limit(1)
    
    if (tasksError) {
      console.error('❌ Daily tasks table error:', tasksError)
      console.log('💡 This means you need to run the SQL setup script!')
      return false
    }
    
    console.log('✅ All database tables exist and are accessible!')
    return true
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error)
    return false
  }
}

export const showSetupInstructions = () => {
  console.log('🚨 DATABASE SETUP REQUIRED!')
  console.log('')
  console.log('It looks like your database tables are not set up yet.')
  console.log('Please follow these steps:')
  console.log('')
  console.log('1. Go to https://supabase.com/dashboard')
  console.log('2. Select your GM AI project')
  console.log('3. Go to SQL Editor (left sidebar)')
  console.log('4. Click "New Query"')
  console.log('5. Copy the SQL script from SUPABASE_SETUP.md')
  console.log('6. Paste and run the script')
  console.log('7. Refresh this page')
  console.log('')
  console.log('Need help? Check the SUPABASE_SETUP.md file for detailed instructions!')
} 