<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Form Đăng Ký</title>
</head>
<body>
    <h1>Đăng Ký Tài Khoản</h1>

    <form id="registerForm">
        <label>Email:</label><br>
        <input type="email" name="email" required><br><br>

        <label>Mật khẩu:</label><br>
        <input type="password" name="matKhau" required><br><br>

        <button type="submit">Đăng Ký</button>
    </form>

    <h2>Response:</h2>
    <pre id="response"></pre>

    <script>
        const form = document.getElementById('registerForm');
        const responseEl = document.getElementById('response');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('http://127.0.0.1:8000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify(data)
                });

                const json = await res.json();
                responseEl.textContent = JSON.stringify(json, null, 4);
            } catch (err) {
                responseEl.textContent = err;
            }
        });
    </script>
</body>
</html>
