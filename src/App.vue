<template>
    <div class="container-xl">
        <div class="row">
            <div class="col">
                <h1>JS Botnet</h1>
                <br />
                <small
                    >Originally written by Mark He, supreme hacker. Made into an
                    app by Matt Anderson, also supreme hacker</small
                >
            </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <p>Current URL to ping (with randomized subpath):</p>
                <div>
                    <editable-string :editText="'Edit URL'" v-model="url" />
                </div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                Switch to:
                <button
                    class="btn btn-primary btn-sm"
                    @click="
                        randomUrls = !randomUrls;
                        confirm = false;
                    "
                >
                    {{ randomUrls ? 'List of URLs' : 'Randomized URLs (404s)' }}
                </button>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col" v-if="randomUrls">
                <p>Number of requests to send:</p>
                <div>
                    <input type="number" v-model="reqs" />
                </div>
            </div>
            <div class="col" v-else>
                <p>
                    Add URL subpaths to test. One URL per line.
                </p>
                <div class="d-flex mb-2">
                    <button
                        class="btn btn-primary btn-sm"
                        @click="editUrlList = !editUrlList"
                        v-if="!editUrlList"
                    >
                        Edit URLs
                    </button>
                    <button
                        class="btn btn-success btn-sm"
                        @click="editUrlList = !editUrlList"
                        v-else
                    >
                        Done
                    </button>
                </div>

                <textarea
                    :value="urlList.join('\n')"
                    @input="updateUrlList"
                    @keyup.enter="updateUrlList"
                    v-if="editUrlList"
                    class="form-control"
                />
                <ol v-else-if="urlList.length > 0">
                    <li
                        v-for="(subpath, index) in urlList"
                        :key="`subpath-${index}`"
                    >
                        {{ url }}{{ subpath }}
                    </li>
                </ol>
                <div v-else>No URLs in the list</div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <p v-if="testUrls.length > 0">Ready?</p>
                <p v-else>
                    <strong>You can't test with no URLs to test!</strong>
                </p>
                <button
                    class="btn btn-success"
                    :class="{ disabled: testing }"
                    :disabled="testing || testUrls.length === 0"
                    v-if="!confirm"
                    @click="confirm = true"
                >
                    Go!
                </button>
                <button
                    class="btn btn-warning"
                    v-if="confirm"
                    @click="
                        confirm = false;
                        ping();
                    "
                >
                    You sure?
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h2>Data</h2>
                <a
                    class="btn btn-primary"
                    :href="JSONurl"
                    download="url-test-session.json"
                >
                    Download as JSON
                </a>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <result-table
                    v-for="(result, index) in results"
                    :key="`result-${result.testNum}`"
                    v-bind="{ result, index }"
                    @metadataChange="
                        this.results[$event.index].metadata = $event.meta
                    "
                />
            </div>
        </div>
    </div>
</template>

<script>
import ResultTable from './components/ResultTable';
import EditableString from './components/EditableString';

export default {
    name: 'App',
    data() {
        return {
            editUrlList: false,
            results: [],
            count: 0,
            url: 'https://contrib-dev.cms.mississauga.ca/',
            reqs: 4,
            testing: false,
            confirm: false,
            urlList: [],
            randomUrls: true,
        };
    },
    components: {
        ResultTable,
        EditableString,
    },
    computed: {
        JSONurl() {
            const contentType = 'application/json';
            const data = JSON.stringify(this.results);
            const blob = new Blob([data], { type: contentType });
            return window.URL.createObjectURL(blob);
        },
        testUrls() {
            const urls = [];
            if (this.randomUrls) {
                for (let i = 0; i < this.reqs; i++) {
                    urls.push(
                        this.url +
                            Math.random()
                                .toString(36)
                                .substring(5)
                    );
                }
            } else {
                this.urlList.forEach((subpath) => {
                    urls.push(this.url + subpath);
                });
            }
            return urls;
        },
    },
    methods: {
        updateUrlList(event) {
            const text = event.target.value;
            this.urlList = text.split('\n').map((url) => {
                console.log({ url });
                return encodeURI(url.trim());
            });
        },
        ping() {
            if (this.testUrls.length === 0) {
                return;
            }
            this.testing = true;
            this.results.push({
                metadata: null,
                status: 'In progress',
                reqs: this.reqs,
                testNum: this.count + 1,
                responseCount: {},
                responses: {},
                url: this.url,
                start: Date.now(),
                end: null,
            });

            let complete = this.testUrls.length;
            this.testUrls.forEach((url) => {
                fetch(url)
                    .then(({ status }) => {
                        if (!this.results[this.count].responseCount[status]) {
                            this.results[this.count].responseCount[status] = 1;
                        } else {
                            this.results[this.count].responseCount[status]++;
                        }
                        this.results[this.count].responses[url] = status;
                    })
                    .catch((resp) => {
                        if (!this.results[this.count].responseCount[resp]) {
                            this.results[this.count].responseCount[resp] = 1;
                        } else {
                            this.results[this.count].responseCount[resp]++;
                        }
                        this.results[this.count].responses[url] = resp;
                    })
                    .finally(() => {
                        complete--;
                        if (complete === 0) {
                            this.results[this.count].status = 'Done';
                            this.results[this.count].end = Date.now();
                            this.testing = false;
                            this.count++;
                        }
                    });
            });
        },
        downloadObjectAsJson(exportName) {
            let dataStr =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(
                    JSON.stringify(this.$store.getters.getFormData)
                );
            let downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', exportName + '.json');
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
    },
    beforeMount() {
        console.clear();
    },
};
</script>
