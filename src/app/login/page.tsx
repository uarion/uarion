import LoginAuthForm from "@/components/LoginAuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">로그인</h1>
        <p className="mt-2 text-slate-400">
          Uarion 계정으로 로그인하거나 이메일로 회원가입하세요.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          유라이온은 인증된 회원만 서비스를 이용할 수 있습니다.
        </p>
      </div>

      <LoginAuthForm />
    </div>
  );
}
