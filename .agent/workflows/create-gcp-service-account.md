---
description: How to create a Google Cloud Service Account and download the JSON key.
---

# Creating a Google Cloud Service Account

Follow these steps to create a Service Account in the Google Cloud Console and download the JSON key file required for your backend.

1.  **Open Google Cloud Console**
    *   Navigate to the [Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts).
    *   Make sure your project (e.g., `agrisakhi-41f7b`) is selected in the top bar.

2.  **Create Service Account**
    *   Click the **+ CREATE SERVICE ACCOUNT** button at the top.
    *   **Service account details**:
        *   **Name**: Enter a name (e.g., `backend-admin`).
        *   **ID**: This will auto-fill.
        *   **Description**: (Optional) e.g., "For AgriSakhi Backend".
    *   Click **CREATE AND CONTINUE**.

3.  **Grant Access (Crucial)**
    *   **Select a role**: Choose **Basic** > **Editor** (or **Owner** if you want full control).
        *   *For more granular security, you can search for "Firebase Admin SDK Administrator Service Agent" or similar, but "Editor" is easiest for development.*
    *   Click **CONTINUE**.
    *   Click **DONE**.

4.  **Create Key (JSON)**
    *   You should now see your new service account in the list.
    *   Click on the **Email address** link of the service account you just created.
    *   Go to the **KEYS** tab (top menu).
    *   Click **ADD KEY** > **Create new key**.
    *   Select **JSON**.
    *   Click **CREATE**.

5.  **Save the File**
    *   A JSON file will automatically download to your computer.
    *   **Rename** this file to `service-account.json`.
    *   **Move** this file to your backend folder: `c:\Users\acer\OneDrive\Desktop\Kishan Saathi\backend\service-account.json`.

6.  **Verify**
    *   Ensure your backend code points to this file path.
