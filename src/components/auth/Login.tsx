import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Sun, Lock, User, AlertCircle } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-2xl mb-3 sm:mb-4">
            <Sun className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl text-slate-900 mb-1 sm:mb-2">AddValues ERP</h1>
          <p className="text-xs sm:text-sm text-slate-600">نظام إدارة الطاقة الشمسية المتكامل</p>
        </div>

        {/* Login Card */}
        <Card className="border border-gray-200">
          <CardHeader className="space-y-1 sm:space-y-2 pb-4 sm:pb-6 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-center text-slate-900">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center text-slate-600 text-xs sm:text-sm">
              أدخل بيانات الدخول للوصول إلى النظام
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="username" className="text-xs sm:text-sm text-slate-700">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pr-10 sm:pr-11 h-10 sm:h-11 border-gray-300 focus:border-slate-900 focus:ring-slate-900 text-sm"
                    required
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm text-slate-700">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 sm:pr-11 h-10 sm:h-11 border-gray-300 focus:border-slate-900 focus:ring-slate-900 text-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[10px] sm:text-xs text-slate-700 mb-2 sm:mb-3">حسابات تجريبية:</p>
              <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                <div className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center gap-2">
                  <span className="text-slate-700">مدير:</span>
                  <code className="text-slate-900 text-[9px] sm:text-xs">admin / admin123</code>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center gap-2">
                  <span className="text-slate-700">كاشير:</span>
                  <code className="text-slate-900 text-[9px] sm:text-xs">cashier1 / cashier123</code>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center gap-2">
                  <span className="text-slate-700">مبيعات:</span>
                  <code className="text-slate-900 text-[9px] sm:text-xs">sales1 / sales123</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] sm:text-xs text-slate-500 mt-4 sm:mt-6">
          © 2024 AddValues. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}