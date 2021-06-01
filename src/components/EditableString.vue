<template>
    <div v-if="editing">
        <input
            type="text"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
        />
        <button class="btn btn-success btn-sm" @click="editing = !editing">
            Done
        </button>
    </div>
    <div v-else>
        {{ modelValue || nullValue || 'No data' }}
        <button class="btn btn-primary btn-sm" @click="editing = !editing">
            {{ editText || 'Edit' }}
        </button>
    </div>
</template>

<script>
export default {
    props: ['modelValue', 'editText', 'nullValue'],
    data() {
        return {
            editing: false,
        };
    },
};
</script>

<style>
input {
    min-width: 450px;
}
</style>
