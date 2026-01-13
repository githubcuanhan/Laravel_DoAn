<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginTaiKhoanRequest;
use App\Http\Requests\Auth\RegisterTaiKhoanRequest;
use App\Http\Requests\Auth\RefreshTokenTaiKhoanRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\TaiKhoan;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Helpers\ApiResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
class AuthController extends Controller
{
    public function register(RegisterTaiKhoanRequest $request)
    {
        $user = TaiKhoan::create([
            'hoTen' => $request->hoTen,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'idLop' => $request->idLop ?? null,
            'maSinhVien' => $request->maSinhVien ?? null,
        ]);
        return ApiResponse::success($user, 'Đăng ký thành công');
    }

    public function login(LoginTaiKhoanRequest $request)
    {
        $credentials = [
            'email' => $request->email,
            'password' => $request->password,
        ];
        if (!$accessToken = JWTAuth::attempt($credentials)) {
            return ApiResponse::error('Email hoặc mật khẩu không đúng', 401);
        }
        $user = auth()->user();
        $user->update(['last_login_at' => now()]);
        $user->save();
        if ($user && $user->trangThai !== 'hoat_dong') {
            auth()->logout();
            return ApiResponse::error('Tài khoản đã bị khoá', 403);
        }
        $refreshToken = $this->issueRefreshToken($request, $user->id);
        return ApiResponse::success([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken->token,
            'refresh_expires_at' => $refreshToken->expires_at,
            'user' => $user->only(['id', 'hoTen', 'email', 'vaiTro', 'trangThai', 'maSinhVien', 'idLop']),
        ], 'Đăng nhập thành công');
    }

    public function logout(Request $request)
    {
        $user = TaiKhoan::find(JWTAuth::user()->idTaikhoan);
        if ($user) {
            RefreshToken::where('idTaikhoan', $user->idTaikhoan)->update(['revoked' => true]);
        }
        JWTAuth::logout();
        return ApiResponse::success([], 'Đăng xuất thành công');
    }

    public function refreshToken(RefreshTokenTaiKhoanRequest $request)
    {
        $plainToken = $request->refresh_token;
        $stored = RefreshToken::where('token', $plainToken)
            ->where('revoked', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();
        if (!$stored) {
            return ApiResponse::error('Refresh token không hợp lệ hoặc đã hết hạn', 401);
        }
        $user = TaiKhoan::find($stored->id);
        if (!$user) {
            return ApiResponse::error('Người dùng không tồn tại', 401);
        }
        if ($user->trangThai !== 'hoat_dong') {
            return ApiResponse::error('Tài khoản đã bị khoá', 403);
        }
        $stored->update(['revoked' => true]);
        $newRefreshToken = $this->issueRefreshToken($request, $user->id);
        $newAccessToken = JWTAuth::fromUser($user);
        return ApiResponse::success([
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken->token,
            'refresh_expires_at' => $newRefreshToken->expires_at,
        ], 'Refresh token thành công');
    }

    private function issueRefreshToken(Request $request, int $id): RefreshToken
    {
        $refreshTtl = config('jwt.refresh_ttl', 20160);
        $expiresAt = now()->addMinutes($refreshTtl);
        return RefreshToken::create([
            'idTaiKhoan' => $id,
            'token' => bin2hex(random_bytes(32)),
            'expires_at' => $expiresAt,
            'revoked' => false,
            'ip' => $request->ip(),
            'user_agent' => (string) $request->header('User-Agent'),
        ]);
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );
            return $status === Password::RESET_LINK_SENT
                ? ApiResponse::success([], 'Email đã được gửi')
                : ApiResponse::error('Email không tồn tại', 404);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 404);
        }
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $setkey = [
            'token' => $request->token,
            'email' => $request->email,
            'password' => $request->password,
            'password_confirmation' => $request->password_confirmation,
        ];
        $status = Password::reset(
            $setkey,
            function (TaiKhoan $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);
                $user->save();
                event(new PasswordReset($user));
            }
        );
        return $status === Password::PASSWORD_RESET
            ? ApiResponse::success([], 'Mật khẩu đã được đặt lại')
            : ApiResponse::error('Mật khẩu không hợp lệ', 400);
    }


    public function me(Request $request)
    {
        $user = auth()->user();
        return ApiResponse::success($user, 'Lấy thông tin người dùng thành công');
    }

}
