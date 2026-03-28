<template>
  <div class="min-h-screen p-8 lg:p-12 bg-app-bg font-sans text-text-primary">
    
    <!-- Header -->
    <header class="max-w-6xl mx-auto mb-16 text-center">
      <h1 class="text-4xl font-black tracking-tight mb-4 text-text-primary">Getting Started Guide</h1>
      <p class="text-lg text-text-muted">Hover over each step to see required fields and detailed workflow.</p>
    </header>

    <!-- Grid Layout -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- Step 1: Company Registration -->
      <div class="card-wrapper">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front card-base flex flex-col items-center justify-center text-center p-8 bg-card-bg border border-border shadow-sm">
              <div class="w-16 h-16 rounded-full bg-text-primary text-card-bg flex items-center justify-center text-2xl font-black mb-6">1</div>
              <h3 class="text-xl font-bold uppercase tracking-widest text-text-primary">Company Registration</h3>
              <p class="mt-4 text-sm text-text-muted font-medium">Click to see form fields</p>
            </div>
            <div class="flip-card-back card-base p-6 flex flex-col bg-card-bg border border-border shadow-sm overflow-y-auto">
              <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Setup Form Fields</h4>
              <div class="space-y-3">
                <div class="field-item">
                  <p class="field-label">Company Name</p>
                  <p class="field-desc">Legal name of your business entity.</p>
                </div>
                <div class="field-item">
                  <p class="field-label">Base Currency</p>
                  <p class="field-desc">Default currency for all accounting entries (PKR, USD, etc).</p>
                </div>
                <div class="field-item">
                  <p class="field-label">NTN / Tax ID</p>
                  <p class="field-desc">Your tax registration number for compliance reporting.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Fiscal Year Start</p>
                   <p class="field-desc">The start date of your accounting year.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="connector-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>

      <!-- Step 2: Inventory -->
      <div class="card-wrapper">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front card-base flex flex-col items-center justify-center text-center p-8 bg-card-bg border border-border shadow-sm">
              <div class="w-16 h-16 rounded-full bg-text-primary text-card-bg flex items-center justify-center text-2xl font-black mb-6">2</div>
              <h3 class="text-xl font-bold uppercase tracking-widest text-text-primary">Items & Inventory</h3>
              <p class="mt-4 text-sm text-text-muted font-medium">SKU and Rate definition</p>
            </div>
            <div class="flip-card-back card-base p-6 flex flex-col bg-card-bg border border-border shadow-sm overflow-y-auto">
              <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Item Form Fields</h4>
              <div class="space-y-3">
                <div class="field-item">
                  <p class="field-label">SKU (Stock Keeping Unit)</p>
                  <p class="field-desc">Unique identifier code for each product.</p>
                </div>
                <div class="field-item">
                  <p class="field-label">Purchase Rate & Sales Price</p>
                  <p class="field-desc">Cost price per unit and default selling price.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Opening Quantity</p>
                   <p class="field-desc">Initial stock on hand when starting the system.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Item Type</p>
                   <p class="field-desc">Distinguish between physical (Product) or non-physical (Service).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="connector-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>

      <!-- Step 3: Parties -->
      <div class="card-wrapper">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front card-base flex flex-col items-center justify-center text-center p-8 bg-card-bg border border-border shadow-sm">
              <div class="w-16 h-16 rounded-full bg-text-primary text-card-bg flex items-center justify-center text-2xl font-black mb-6">3</div>
              <h3 class="text-xl font-bold uppercase tracking-widest text-text-primary">Parties</h3>
              <p class="mt-4 text-sm text-text-muted font-medium">Customer & Supplier Setup</p>
            </div>
            <div class="flip-card-back card-base p-6 flex flex-col bg-card-bg border border-border shadow-sm overflow-y-auto">
              <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Party Form Fields</h4>
              <div class="space-y-3">
                <div class="field-item">
                  <p class="field-label">Party Type</p>
                  <p class="field-desc">Define if the party is a Customer or a Supplier.</p>
                </div>
                <div class="field-item">
                  <p class="field-label">Full Name / Company</p>
                  <p class="field-desc">Legal name of your vendor or client.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Tax ID / NTN</p>
                   <p class="field-desc">Identifier for tax invoicing purposes.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Contact Info</p>
                   <p class="field-desc">Phone and Email for automated notifications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="connector-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>

      <!-- Step 4: Sales/Purchase Transactions -->
      <div class="card-wrapper">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front card-base flex flex-col items-center justify-center text-center p-8 bg-card-bg border border-border shadow-sm">
              <div class="w-16 h-16 rounded-full bg-text-primary text-card-bg flex items-center justify-center text-2xl font-black mb-6">4</div>
              <h3 class="text-xl font-bold uppercase tracking-widest text-text-primary">Transactions</h3>
              <p class="mt-4 text-sm text-text-muted font-medium">Invoices & Bills</p>
            </div>
            <div class="flip-card-back card-base p-6 flex flex-col bg-card-bg border border-border shadow-sm overflow-y-auto">
              <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Transaction Fields</h4>
              <div class="space-y-3">
                <div class="field-item">
                  <p class="field-label">Party Selector</p>
                  <p class="field-desc">Choose which customer/supplier is involved.</p>
                </div>
                <div class="field-item">
                  <p class="field-label">Item Line Details</p>
                  <p class="field-desc">Select Item, set Qty and custom Rate for this transaction.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Transaction Date</p>
                   <p class="field-desc">The date the sale or purchase occurred.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Save & Post</p>
                   <p class="field-desc">This action commits the data to your Ledger (GL).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="connector-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>

      <!-- Step 5: Reports -->
      <div class="card-wrapper col-md-span-2 lg:col-span-1">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front card-base flex flex-col items-center justify-center text-center p-8 bg-card-bg border border-border shadow-sm">
              <div class="w-16 h-16 rounded-full bg-text-primary text-card-bg flex items-center justify-center text-2xl font-black mb-6">5</div>
              <h3 class="text-xl font-bold uppercase tracking-widest text-text-primary">Reports</h3>
              <p class="mt-4 text-sm text-text-muted font-medium">Business Health</p>
            </div>
            <div class="flip-card-back card-base p-6 flex flex-col bg-card-bg border border-border shadow-sm text-center justify-center overflow-y-auto">
              <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Financial Reports</h4>
              <div class="space-y-4">
                <div class="field-item">
                  <p class="field-label">Profit & Loss</p>
                  <p class="field-desc">Summary of Revenue minus Expenses over time.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">Balance Sheet</p>
                   <p class="field-desc">Snapshot of Assets, Liabilities, and Equity.</p>
                </div>
                <div class="field-item">
                   <p class="field-label">General Ledger</p>
                   <p class="field-desc">Detailed history of every transaction record.</p>
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
// Interactive guide component with field-specific documentation
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');

.card-wrapper {
  position: relative;
  width: 100%;
}

.flip-card {
  background-color: transparent;
  width: 100%;
  height: 380px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: left;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  cursor: pointer;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 20px;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.card-base {
  background: var(--card-bg);
  border: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: border-color 0.3s ease;
}

.flip-card:hover .card-base {
  border-color: var(--text-primary);
}

/* Field Item Styling */
.field-item {
  text-align: left;
}
.field-label {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}
.field-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Animated Arrows */
.connector-arrow {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  z-index: 10;
  animation: floatArrow 2s infinite ease-in-out;
}

@keyframes floatArrow {
  0%, 100% { transform: translate(0, 0); opacity: 0.3; }
  50% { transform: translate(8px, 0); opacity: 1; }
}

/* Desktop layout (3 cols) */
@media (min-width: 1024px) {
  .connector-arrow {
    right: -28px;
    top: 50%;
    transform: translateY(-50%);
  }
}

/* Tablet layout (2 cols) */
@media (min-width: 768px) and (max-width: 1023px) {
  .connector-arrow {
    right: -28px;
    top: 50%;
    transform: translateY(-50%);
  }
}

/* Mobile layout (1 col) */
@media (max-width: 767px) {
  .connector-arrow {
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
    animation: floatArrowVertical 2s infinite ease-in-out;
  }
}

@keyframes floatArrowVertical {
  0%, 100% { transform: translateX(-50%) rotate(90deg) translateY(0); opacity: 0.3; }
  50% { transform: translateX(-50%) rotate(90deg) translateY(8px); opacity: 1; }
}
</style>
