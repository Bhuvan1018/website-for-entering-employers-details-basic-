import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Train, Mail, Lock, User, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CadreType, DepartmentType, DivisionType } from '../../types';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  full_name: z.string().min(2, 'Full name is required'),
  employee_id: z.string().min(1, 'Employee ID is required'),
  cadre: z.enum(['Officer', 'Supervisor', 'Skilled', 'Semi-skilled', 'Unskilled']),
  department: z.enum(['Operations', 'Engineering', 'Signal & Telecom', 'Electrical', 'Commercial', 'Personnel', 'Accounts', 'Medical', 'Security', 'Stores']),
  division: z.enum(['Central Railway', 'Eastern Railway', 'Northern Railway', 'North Eastern Railway', 'Northeast Frontier Railway', 'Southern Railway', 'South Central Railway', 'South Eastern Railway', 'South East Central Railway', 'Western Railway', 'West Central Railway', 'North Western Railway', 'North Central Railway', 'East Central Railway', 'East Coast Railway', 'South Western Railway']),
  designation: z.string().min(1, 'Designation is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  date_of_joining: z.string().min(1, 'Date of joining is required'),
  phone_number: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(10, 'Address is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignIn = async (data: SignInFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = {
        full_name: data.full_name,
        employee_id: data.employee_id,
        cadre: data.cadre,
        department: data.department,
        division: data.division,
        designation: data.designation,
        date_of_birth: data.date_of_birth,
        date_of_joining: data.date_of_joining,
        phone_number: data.phone_number,
        address: data.address,
      };

      const { error } = await signUp(data.email, data.password, userData);
      if (error) throw error;
      
      // Switch to sign in form after successful registration
      setIsSignUp(false);
      signUpForm.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cadreOptions: CadreType[] = ['Officer', 'Supervisor', 'Skilled', 'Semi-skilled', 'Unskilled'];
  const departmentOptions: DepartmentType[] = ['Operations', 'Engineering', 'Signal & Telecom', 'Electrical', 'Commercial', 'Personnel', 'Accounts', 'Medical', 'Security', 'Stores'];
  const divisionOptions: DivisionType[] = ['Central Railway', 'Eastern Railway', 'Northern Railway', 'North Eastern Railway', 'Northeast Frontier Railway', 'Southern Railway', 'South Central Railway', 'South Eastern Railway', 'South East Central Railway', 'Western Railway', 'West Central Railway', 'North Western Railway', 'North Central Railway', 'East Central Railway', 'East Coast Railway', 'South Western Railway'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 text-white p-6 text-center">
          <Train className="h-12 w-12 mx-auto mb-3 text-orange-400" />
          <h1 className="text-2xl font-bold">Indian Railways</h1>
          <p className="text-blue-200 text-sm">Employee Portal</p>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isSignUp
                  ? 'bg-blue-800 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isSignUp
                  ? 'bg-blue-800 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          {!isSignUp && (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="signin-email"
                    type="email"
                    {...signInForm.register('email')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                {signInForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{signInForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="signin-password"
                    type="password"
                    {...signInForm.register('password')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
                {signInForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{signInForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {isSignUp && (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="signup-email"
                      type="email"
                      {...signUpForm.register('email')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                  {signUpForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="signup-password"
                      type="password"
                      {...signUpForm.register('password')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a password"
                    />
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirm-password"
                      type="password"
                      {...signUpForm.register('confirmPassword')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="full-name"
                      type="text"
                      {...signUpForm.register('full_name')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {signUpForm.formState.errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="employee-id" className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    id="employee-id"
                    type="text"
                    {...signUpForm.register('employee_id')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your employee ID"
                  />
                  {signUpForm.formState.errors.employee_id && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.employee_id.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cadre" className="block text-sm font-medium text-gray-700 mb-1">
                      Cadre
                    </label>
                    <select
                      id="cadre"
                      {...signUpForm.register('cadre')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Cadre</option>
                      {cadreOptions.map((cadre) => (
                        <option key={cadre} value={cadre}>{cadre}</option>
                      ))}
                    </select>
                    {signUpForm.formState.errors.cadre && (
                      <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.cadre.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      id="department"
                      {...signUpForm.register('department')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {signUpForm.formState.errors.department && (
                      <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.department.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                    Railway Division
                  </label>
                  <select
                    id="division"
                    {...signUpForm.register('division')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Railway Division</option>
                    {divisionOptions.map((division) => (
                      <option key={division} value={division}>{division}</option>
                    ))}
                  </select>
                  {signUpForm.formState.errors.division && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.division.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="designation"
                      type="text"
                      {...signUpForm.register('designation')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your designation"
                    />
                  </div>
                  {signUpForm.formState.errors.designation && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.designation.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date-of-birth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="date-of-birth"
                        type="date"
                        {...signUpForm.register('date_of_birth')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    {signUpForm.formState.errors.date_of_birth && (
                      <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.date_of_birth.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="date-of-joining" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Joining
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="date-of-joining"
                        type="date"
                        {...signUpForm.register('date_of_joining')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    {signUpForm.formState.errors.date_of_joining && (
                      <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.date_of_joining.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="phone-number"
                      type="tel"
                      {...signUpForm.register('phone_number')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {signUpForm.formState.errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.phone_number.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="address"
                      rows={3}
                      {...signUpForm.register('address')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter your complete address"
                    />
                  </div>
                  {signUpForm.formState.errors.address && (
                    <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.address.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;