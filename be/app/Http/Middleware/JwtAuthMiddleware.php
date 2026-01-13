<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use App\Helpers\ApiResponse;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->cookie('access_token') ?? $request->bearerToken();
            if (!$token) {
                return ApiResponse::error('Token không được cung cấp', 401);
            }
            $user = JWTAuth::setToken($token)->authenticate();
            if (!$user) {
                return ApiResponse::error('Token không hợp lệ', 401);
            }
            if ($user->trangThai !== 'hoat_dong') {
                return ApiResponse::error('Tài khoản đã bị khoá', 403);
            }
            auth()->setUser($user);
        } catch (TokenExpiredException $e) {
            return ApiResponse::error('Token đã hết hạn', 401);
        } catch (TokenInvalidException $e) {
            return ApiResponse::error('Token không hợp lệ', 401);
        } catch (JWTException $e) {
            return ApiResponse::error('Token không được cung cấp', 401);
        }
        return $next($request);
    }
}
