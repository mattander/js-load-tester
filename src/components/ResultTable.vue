<template>
    <div class="mt-4">
        <h2>Test {{ result.testNum }}</h2>
        <editable-string
            :editText="'Edit metadata'"
            :nullValue="'No metadata'"
            :model-value="result.metadata"
            @update:model-value="
                $emit('metadataChange', {
                    index,
                    meta: $event,
                })
            "
        />
        <div>Tested {{ result.url }}</div>
        <div><strong>Status: </strong>{{ result.status }}</div>
        <table class="table">
            <thead>
                <th>Status</th>
                <th>Count</th>
            </thead>
            <tbody>
                <tr
                    v-for="(count, status) in result.responseCount"
                    :key="`${status}-row`"
                >
                    <td>{{ status }}</td>
                    <td>{{ count }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import EditableString from './EditableString.vue';
export default {
    props: ['result', 'index'],
    components: {
        EditableString,
    },
    data() {
        return {
            title: '',
        };
    },
};
</script>

<style></style>
