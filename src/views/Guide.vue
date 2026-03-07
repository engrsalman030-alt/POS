<template>
  <div class="h-full flex flex-col" style="background:#F6F6F6; font-family:'Inter',sans-serif;">
    
    <!-- Header -->
    <div class="px-8 py-6" style="background:#fff; border-bottom:1px solid #E2E2E2;">
      <h1 class="text-xl font-bold" style="color:#171717;">How to Use This App</h1>
      <p class="text-sm mt-1" style="color:#999;">A step-by-step guide to mastering the application flow.</p>
    </div>

    <!-- Timeline -->
    <div class="flex-1 overflow-auto p-8">
      <div class="max-w-3xl mx-auto space-y-6">

        <!-- Step 1: Company Setup -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style="background:#EDFBF4; color:#278F5E; border:2px solid #46B37E;">1</div>
            <div class="w-px flex-1 mt-2" style="background:#E2E2E2;"></div>
          </div>
          <div class="flex-1 pb-6">
            <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:#EDFBF4;">🏢</span>
                <h3 class="font-bold text-base" style="color:#171717;">Company Registration</h3>
              </div>
              <p class="text-sm leading-relaxed mb-4" style="color:#525252;">
                When you first start, initialize your local-first accounting system on the Setup screen:
              </p>
              <ul class="text-sm space-y-2" style="color:#525252;">
                <li class="flex items-start gap-2">
                  <span style="color:#46B37E; margin-top:2px;">•</span>
                  <span><strong style="color:#171717;">Company Name:</strong> Enter your registered company name (e.g. Acme Pakistan Pvt Ltd).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span style="color:#46B37E; margin-top:2px;">•</span>
                  <span><strong style="color:#171717;">Base Currency:</strong> Select your operating currency (e.g. PKR, USD, EUR).</span>
                </li>
                <li class="flex items-start gap-2">
                  <span style="color:#46B37E; margin-top:2px;">•</span>
                  <span><strong style="color:#171717;">NTN / Registration:</strong> Enter your tax registration number for compliance.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span style="color:#46B37E; margin-top:2px;">•</span>
                  <span><strong style="color:#171717;">Fiscal Year Start:</strong> Pick your financial year start date (defaults to July 1st).</span>
                </li>
              </ul>
              <div class="mt-4 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
                style="background:#EDFBF4; color:#278F5E;">
                <span>💡</span>
                <span class="font-medium">This will seed your initial Chart of Accounts and Tax Settings.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Items & Parties -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style="background:#EDFBF4; color:#278F5E; border:2px solid #46B37E;">2</div>
            <div class="w-px flex-1 mt-2" style="background:#E2E2E2;"></div>
          </div>
          <div class="flex-1 pb-6 space-y-4">

            <!-- Items -->
            <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:#FFFBEE;">📦</span>
                <h4 class="font-bold text-base" style="color:#171717;">Add Inventory Items</h4>
              </div>
              <p class="text-sm mb-3" style="color:#525252;">Go to <strong style="color:#171717;">Items & Stock</strong> to define what you buy and sell:</p>
              <ul class="text-sm space-y-2" style="color:#525252;">
                <li class="flex items-start gap-2"><span style="color:#E79913;">•</span><span>Click <strong style="color:#171717;">+ Add New Item</strong>.</span></li>
                <li class="flex items-start gap-2"><span style="color:#E79913;">•</span><span>Enter a <strong style="color:#171717;">SKU</strong> (Stock Keeping Unit).</span></li>
                <li class="flex items-start gap-2"><span style="color:#E79913;">•</span><span>Select the <strong style="color:#171717;">Type</strong> (Product or Service).</span></li>
                <li class="flex items-start gap-2"><span style="color:#E79913;">•</span><span>Define <strong style="color:#171717;">Purchase Rate</strong> and <strong style="color:#171717;">Sales Price</strong>.</span></li>
              </ul>
            </div>

            <!-- Parties -->
            <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:#EEF4FF;">👥</span>
                <h4 class="font-bold text-base" style="color:#171717;">Add Parties</h4>
              </div>
              <p class="text-sm mb-3" style="color:#525252;">Navigate to <strong style="color:#171717;">Parties</strong> to add your network:</p>
              <ul class="text-sm space-y-2" style="color:#525252;">
                <li class="flex items-start gap-2"><span style="color:#4C9CF1;">•</span><span>Click <strong style="color:#171717;">+ Add New Party</strong>.</span></li>
                <li class="flex items-start gap-2"><span style="color:#4C9CF1;">•</span><span>Choose <strong style="color:#171717;">Party Type:</strong> Customer or Supplier.</span></li>
                <li class="flex items-start gap-2"><span style="color:#4C9CF1;">•</span><span>Enter their <strong style="color:#171717;">Name</strong>, NTN / CNIC and Email.</span></li>
              </ul>
            </div>

          </div>
        </div>

        <!-- Step 3: Purchases -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style="background:#EDFBF4; color:#278F5E; border:2px solid #46B37E;">3</div>
            <div class="w-px flex-1 mt-2" style="background:#E2E2E2;"></div>
          </div>
          <div class="flex-1 pb-6">
            <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:#EDFBF4;">🧾</span>
                <h3 class="font-bold text-base" style="color:#171717;">Purchase Items</h3>
              </div>
              <p class="text-sm leading-relaxed mb-4" style="color:#525252;">
                Navigate to <strong style="color:#171717;">Purchase Bills</strong> and click "+ Create Bill".
              </p>
              <ul class="text-sm space-y-2 mb-4" style="color:#525252;">
                <li class="flex items-start gap-2"><span style="color:#46B37E;">•</span><span>Select a <strong style="color:#171717;">Supplier</strong> from the dropdown.</span></li>
                <li class="flex items-start gap-2"><span style="color:#46B37E;">•</span><span>Choose the <strong style="color:#171717;">Date</strong> of the purchase.</span></li>
              </ul>
              <div class="rounded-lg p-4" style="background:#F6F6F6; border:1px solid #E2E2E2;">
                <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color:#999;">Add Line Items</p>
                <div class="text-sm space-y-1.5" style="color:#525252;">
                  <p>1. Choose an <strong style="color:#171717;">Item</strong> from the dropdown.</p>
                  <p>2. Enter the <strong style="color:#171717;">Qty</strong> — rate auto-fills from item settings.</p>
                  <p>3. The <strong style="color:#171717;">Total</strong> calculates automatically.</p>
                </div>
              </div>
              <p class="text-sm mt-4" style="color:#525252;">
                Click <strong style="color:#278F5E;">Save & Update Stock</strong> to post to the ledger.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 4: Sales -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style="background:#EDFBF4; color:#278F5E; border:2px solid #46B37E;">4</div>
            <div class="w-px flex-1 mt-2" style="background:#E2E2E2;"></div>
          </div>
          <div class="flex-1 pb-6">
            <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:#EEF4FF;">📄</span>
                <h3 class="font-bold text-base" style="color:#171717;">Sell Items</h3>
              </div>
              <p class="text-sm leading-relaxed mb-4" style="color:#525252;">
                Go to <strong style="color:#171717;">Sales Invoices</strong> and click "+ Create Invoice".
              </p>
              <ul class="text-sm space-y-2 mb-4" style="color:#525252;">
                <li class="flex items-start gap-2"><span style="color:#4C9CF1;">•</span><span>Select a <strong style="color:#171717;">Customer</strong> from the dropdown.</span></li>
                <li class="flex items-start gap-2"><span style="color:#4C9CF1;">•</span><span>Select the <strong style="color:#171717;">Date</strong> of the sale.</span></li>
              </ul>
              <div class="rounded-lg p-4" style="background:#F6F6F6; border:1px solid #E2E2E2;">
                <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color:#999;">Add Line Items</p>
                <div class="text-sm space-y-1.5" style="color:#525252;">
                  <p>1. Choose an <strong style="color:#171717;">Item</strong> from the dropdown.</p>
                  <p>2. Enter the <strong style="color:#171717;">Qty</strong> — sales rate auto-fills.</p>
                  <p>3. The <strong style="color:#171717;">Subtotal</strong> calculates automatically.</p>
                </div>
              </div>
              <p class="text-sm mt-4" style="color:#525252;">
                Click <strong style="color:#278F5E;">Save & Post to Ledger</strong> to recognize revenue and decrease stock.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 5: Reports -->
        <div class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style="background:#EDFBF4; color:#278F5E; border:2px solid #46B37E;">5</div>
          </div>
          <div class="flex-1 pb-6">
            <div class="rounded-xl p-6" style="background:#fff; border:1px solid #E2E2E2;">
              <div class="flex items-center gap-3 mb-4">
                <span class="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style="background:#EDFBF4;">📈</span>
                <h3 class="font-bold text-base" style="color:#171717;">View Financial Reports</h3>
              </div>
              <p class="text-sm leading-relaxed mb-5" style="color:#525252;">
                Navigate to <strong style="color:#171717;">Reports</strong> to analyze your business performance in real-time.
              </p>
              <div class="space-y-3">

                <div class="rounded-lg p-4" style="background:#F6F6F6; border:1px solid #E2E2E2;">
                  <h5 class="font-bold text-sm mb-2 flex items-center gap-2" style="color:#171717;">
                    <span class="w-2 h-2 rounded-full" style="background:#4C9CF1;"></span>
                    Profit & Loss Tab
                  </h5>
                  <p class="text-xs leading-relaxed" style="color:#525252;">Review your <strong style="color:#171717;">Total Income</strong> vs <strong style="color:#171717;">Total Expenses</strong>. Check your <strong style="color:#171717;">Net Profit / Loss</strong> and <strong style="color:#171717;">Profit Margin %</strong> at the bottom.</p>
                </div>

                <div class="rounded-lg p-4" style="background:#F6F6F6; border:1px solid #E2E2E2;">
                  <h5 class="font-bold text-sm mb-2 flex items-center gap-2" style="color:#171717;">
                    <span class="w-2 h-2 rounded-full" style="background:#46B37E;"></span>
                    Balance Sheet Tab
                  </h5>
                  <p class="text-xs leading-relaxed" style="color:#525252;">View your <strong style="color:#171717;">Assets</strong> (Cash, Receivables, Inventory) against <strong style="color:#171717;">Liabilities</strong> and <strong style="color:#171717;">Equity</strong>. Ensure it reads <strong style="color:#278F5E;">Balanced ✓</strong>.</p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page is a static detailed guide component
</script>
