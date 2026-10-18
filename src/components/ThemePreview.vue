<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import DatePicker from 'primevue/datepicker'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import ProgressBar from 'primevue/progressbar'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import ToggleSwitch from 'primevue/toggleswitch'
import { useAccent } from '@/theme/useAccent'
import { useFont, fonts, type FontName } from '@/theme/useFont'
import { useThemeMode } from '@/theme/useThemeMode'

const { isDark, toggle } = useThemeMode()
const { accent } = useAccent()
const { font } = useFont()

const accentOptions = [
  { label: 'Deep', value: 'deep' },
  { label: 'Verdant', value: 'verdant' },
  { label: 'Pine', value: 'pine' },
]

const fontOptions = (Object.keys(fonts) as FontName[]).map((value) => ({
  label: fonts[value].label,
  value,
}))

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const categories = ['sight', 'food', 'transport', 'hotel', 'shop'] as const

const title = ref('龍山寺 Longshan Temple')
const cost = ref(120)
const notes = ref('Go early — CNY crowds peak after 10am.')
const done = ref(true)
const liveMap = ref(true)
const mode = ref('MRT')
const modes = ['Walk', 'MRT', 'Drive']
const city = ref('Taipei')
const cities = ['Taipei', 'Tainan', 'Hualien']
const time = ref<Date | null>(null)
</script>

<template>
  <div class="preview">
    <section class="appearance">
      <div class="field">
        <span>Appearance</span>
        <div class="check">
          <ToggleSwitch
            :model-value="isDark"
            input-id="dark-mode"
            @update:model-value="toggle()"
          />
          <label for="dark-mode">{{ isDark ? 'Dark' : 'Light' }}</label>
        </div>
      </div>
      <div class="field">
        <span>Accent</span>
        <SelectButton
          v-model="accent"
          :options="accentOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
        />
      </div>
      <div class="field">
        <span>Font</span>
        <SelectButton
          v-model="font"
          :options="fontOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
        />
      </div>
    </section>

    <Divider />

    <section>
      <h2>Accent — jade primary ({{ accent }})</h2>
      <p class="hint">
        These bars read <code>--p-primary-*</code>, so swapping the ramp above or in
        <code>preset.ts</code> changes every one.
      </p>
      <div class="ramp">
        <div v-for="shade in shades" :key="shade" class="ramp-item">
          <div class="ramp-chip" :style="{ background: `var(--p-primary-${shade})` }" />
          <span class="tw-num">{{ shade }}</span>
        </div>
      </div>
    </section>

    <Divider />

    <section>
      <h2>Buttons &amp; tags</h2>
      <div class="row">
        <Button label="New trip" icon="pi pi-plus" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Outlined" outlined />
        <Button label="Text" text />
        <Button icon="pi pi-map" rounded aria-label="Map" />
        <Button label="Disabled" disabled />
      </div>
      <div class="row">
        <Tag value="Food ritual" severity="success" />
        <Tag value="Local favorite" severity="info" />
        <Tag value="Packed" severity="warn" />
        <Tag value="Closed" severity="danger" />
      </div>
    </section>

    <Divider />

    <section>
      <h2>Activity categories</h2>
      <p class="hint">
        Shared tokens (<code>--tw-category-*</code>) for timeline, icons, tags, and map
        markers.
      </p>
      <div class="row">
        <Tag
          v-for="category in categories"
          :key="category"
          :style="{
            background: `var(--tw-category-${category})`,
            color: '#fff',
            border: 'none',
          }"
        >
          <i class="pi pi-circle-fill" style="margin-right: 0.35rem; font-size: 0.5rem" />
          {{ category }}
        </Tag>
      </div>
    </section>

    <Divider />

    <section>
      <h2>Form controls</h2>
      <div class="grid">
        <label class="field">
          <span>Title</span>
          <InputText v-model="title" />
        </label>
        <label class="field">
          <span>Cost (NT$)</span>
          <InputNumber v-model="cost" mode="currency" currency="TWD" locale="zh-TW" />
        </label>
        <label class="field">
          <span>Time</span>
          <DatePicker
            v-model="time"
            time-only
            hour-format="24"
            placeholder="Pick a time"
          />
        </label>
        <label class="field">
          <span>City</span>
          <Select v-model="city" :options="cities" />
        </label>
        <div class="field">
          <span>Transport mode</span>
          <SelectButton v-model="mode" :options="modes" :allow-empty="false" />
        </div>
        <div class="field">
          <span>Flags</span>
          <div class="row">
            <span class="check">
              <Checkbox v-model="done" binary input-id="done" />
              <label for="done">Done</label>
            </span>
            <span class="check">
              <ToggleSwitch v-model="liveMap" />
              <label>Show on map</label>
            </span>
          </div>
        </div>
        <label class="field field-wide">
          <span>Notes</span>
          <Textarea v-model="notes" rows="3" auto-resize />
        </label>
      </div>
    </section>

    <Divider />

    <section>
      <h2>Surfaces &amp; feedback</h2>
      <div class="cards">
        <Card>
          <template #title>Day 3 · 台北</template>
          <template #content>
            <p class="tw-num">3 stops · NT$2,480</p>
            <ProgressBar :value="66" />
          </template>
        </Card>
        <div class="stack">
          <Message severity="success" :closable="false"
            >Auto-arrange saved ~12 min.</Message
          >
          <Message severity="warn" :closable="false"
            >CNY holiday: expect crowds Feb 6–8.</Message
          >
        </div>
      </div>
    </section>

    <Divider />

    <section>
      <h2>Numbers</h2>
      <p class="tw-num big">NT$12,480 · 14:05 · 8/12 done</p>
    </section>
  </div>
</template>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 3rem;
}

.appearance {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

h2 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  color: var(--p-text-color);
}

.hint {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

code {
  font-size: 0.85em;
  background: var(--p-surface-100);
  padding: 0.05rem 0.3rem;
  border-radius: 4px;
}

.ramp {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 0.25rem;
}

.ramp-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  opacity: 0.85;
}

.ramp-chip {
  width: 100%;
  height: 2.5rem;
  border-radius: 6px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.row + .row {
  margin-top: 0.75rem;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
}

.field > span {
  opacity: 0.75;
}

.field-wide {
  grid-column: 1 / -1;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.big {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}
</style>
