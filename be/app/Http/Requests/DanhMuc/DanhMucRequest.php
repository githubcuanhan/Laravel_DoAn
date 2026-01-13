<?php

namespace App\Http\Requests\DanhMuc;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use App\Helpers\ApiResponse;

class DanhMucRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'tenDanhmuc' => ['required', 'string', 'max:50'],
      'moTa'  => ['nullable', 'string', 'max:255'],
    ];
  }

  public function messages(): array
  {
    return [
      'tenDanhmuc.required' => 'Vui lòng nhập tên danh mục',
      'tenDanhmuc.max' => 'Tên danh mục không được quá 50 ký tự',
      'moTa.max' => 'Mô tả quá dài',
    ];
  }
  public function failedValidation(Validator $validator)
  {
    ApiResponse::validation($validator->errors());
  }
}
