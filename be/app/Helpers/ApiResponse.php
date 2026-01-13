<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApiResponse
{
    /**
     * Trả về response thành công
     */
    public static function success($data = null, string $message = 'Thành công', int $status = 200): JsonResponse
    {
        return Response::json([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ], $status);
    }

    /**
     * Trả về response lỗi
     */
    public static function error(string $message = 'Lỗi', int $status = 400, $data = null): JsonResponse
    {
        return Response::json([
            'success' => false,
            'message' => $message,
            'data'    => $data
        ], $status);
    }

    /**
     * Trả về lỗi validation
     */
    public static function validation($errors, string $message = 'Dữ liệu không hợp lệ'): void
    {
        throw new HttpResponseException(
            Response::json([
                'success' => false,
                'message' => $message,
                'errors'  => $errors
            ], 422)
        );
    }
}
