<?php

namespace App\Http\Requests\Lop;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use App\Helpers\ApiResponse;
class LopRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'tenLop' => [
                'required',
                'string',
                'max:255',
                Rule::unique('lop', 'tenLop')->ignore($id, 'idLop'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'tenLop.required' => 'Tên lớp là bắt buộc',
            'tenLop.unique' => 'Tên lớp đã tồn tại',
            'tenLop.max' => 'Tên lớp không được quá 255 ký tự',
        ];
    }


    public function failedValidation(Validator $validator)
    {
        ApiResponse::validation($validator->errors());
    }



}

