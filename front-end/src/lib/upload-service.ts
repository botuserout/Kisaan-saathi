export async function uploadImage(file: File, token: string): Promise<{ imageUrl: string; imageId: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
        const validApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
        const response = await fetch(`${validApiUrl}/upload/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            signal: controller.signal
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return response.json();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error('Upload timed out. Please check your internet connection.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
