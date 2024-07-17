import { createStore } from "vuex";
import axios from 'axios'

export default createStore({
    state: {
        allLabels: [],
        allReleases: [],
        releases: [],
        sortedLabels: [],
        youtubes: [],
        onYoutubeCount: 0,
        onRevibedCount: 0,
        ytbDistributors: [],
        distributors: [],
        allDataReady: false
    },
    actions: {
        // makeBackup({commit}) {
        //     commit('backupState')
        // },
        async getAllData ({ state, commit }) {
            state.allDataReady = false
            const response1 = await axios.get(`http://localhost:3000/get-youtubes`);
            console.log("getYoutubes response ", response1.data);
            if (response1.data.success) {
                commit('setYoutubes', response1.data)
            }
            const response2 = await axios.get(`http://localhost:3000/get-labels`);
            console.log("getLabels response ", response2.data);
            if (response2.data.success) {
                commit('setLabels', response2.data)
            }
            const response3 = await axios.get(`http://localhost:3000/get-releases`);
            console.log("getReleases response ", response3.data);
            if (response3.data.success) {
                commit('setReleases', response3.data)
            }
            const response4 = await axios.get(`http://localhost:3000/get-distributors`);
            console.log("getDistributors response ", response4.data);
            if (response4.data.success) {
                commit('setDistributors', response4.data)
            }
        },
        async getLabels({ state, commit }) {
            const { data } = await axios.get(`http://localhost:3000/get-labels`);
            console.log("getLabels response ", data);
            if (data.success) {
                commit('setLabels', data)
            }
        },
        async editLabel({ state, dispatch }, labelData) {
            let label = labelData.label
            let status = labelData.status
            let labelID = labelData.label._id
            let contacts = labelData.label.contacts
            console.log('labelID ', labelID)
            console.log('status ', status)
            console.log('contacts ', contacts)
            
            if (label) {
                const { data } = await axios.put('http://localhost:3000/edit-label/'+labelID, { status: status, contacts: contacts})
                console.log('response after edit: ', data)
            }

            await dispatch('getAllData')
        },
        async exportLabels({ state, commit }, labels) {
            console.log('exportLabels ', labels)
            const { data } = await axios.post('http://localhost:3000/export-labels/', { labels: labels}, { responseType: "arraybuffer" } )
            console.log('exportLabels response: ', data)
            forceFileDownload(data, 'export-labels.csv')

        },
        async exportReleases({ state, commit }, releases) {
            console.log('exportReleases ', releases)
            const { data } = await axios.post('http://localhost:3000/export-releases/', { releases: releases}, { responseType: "arraybuffer" } )
            console.log('exportReleases response: ', data)
            forceFileDownload(data, 'export-releases.csv')

        },
        async getReleases({ state, commit }) {
            const { data } = await axios.get(`http://localhost:3000/get-releases`);
            console.log("getReleases response ", data);
            if (data.success) {
                commit('setReleases', data)
            }
        },
        async editRelease({ state, dispatch }, releaseData) {
            console.log('releaseData ', releaseData)
            
            let release = {
                status: releaseData.release.status,
                id: releaseData.release._id,
                youtubeCopyrightOwners: releaseData.release.youtubeCopyrightOwners,
                onRevibed: releaseData.release.onRevibed,
                notes: releaseData.release.notes
            }
            console.log('editRelease ', release)
            if (release) {
                const { data } = await axios.put('http://localhost:3000/edit-release/'+release.id, {release: release})
                console.log('response after edit: ', data)
            }
            await dispatch('getAllData')
        },
        async deleteRelease({ state, commit }, releaseData) {
            console.log('releaseData ', releaseData)
            
            let release = {
                id: releaseData.release._id
            }
            console.log('deleteRelease ', release)
            if (release) {
                const { data } = await axios.delete('http://localhost:3000/delete-release/'+release.id)
                console.log('response after delete: ', data)
            }        
        },  
        async editYoutube({ state, dispatch }, youtubeData) {
            console.log('youtubeData ', youtubeData)
            let youtube = {
                discogsRelease: youtubeData.youtube.discogsRelease,
                id: youtubeData.youtube._id,
            }
            console.log('editYoutube ', youtube)
            if (youtube) {
                const { data } = await axios.put('http://localhost:3000/edit-youtube/'+youtube.id, {youtube: youtube})
                console.log('response after edit: ', data)
            }
            await dispatch('getAllData')
        },  
        async editDistributor({ state, dispatch }, labelData) {
            let contacts = labelData.label.contacts
            let status = labelData.status
            let labelID = labelData.label._id
            
            if (labelData) {
                const { data } = await axios.put('http://localhost:3000/edit-distributor/'+labelID, { contacts: contacts, status: status})
                console.log('response after edit: ', data)
            }
            await dispatch('getAllData')
        },
    },
    mutations: {
        setYoutubes(state, data) { 
            state.youtubes = data.youtubes
        },
        setDistributors(state, data) { 
            state.distributors = data.distributors

            state.distributors.map(distributor => {
                distributor.releases = []
                distributor.count = 0
                for (let release of state.releases) {
                    if (release.youtubeCopyrightOwners.length) {
                        for (let row of release.youtubeCopyrightOwners) {
                            if (row.distributor.length) {
                                for (let item of row.distributor) {
                                    if (item === distributor.name) {
                                        distributor.releases.push(release)
                                        distributor.count += 1
                                    }
                                }
                            }
                        }
                    }
                }
                return distributor
            })

            state.distributors.sort((a, b) => {
                return b.count - a.count;
            });

        },
        setLabels(state, data) { 
            state.allLabels = data.labels
        },
        setReleases(state, data) { 

            console.time("Time 1");

            function getParentLabel(labelID) {
                let label = state.allLabels.find(item => item.id === labelID)
                if (!label) return label
                if (label.parent_label) {
                    return getParentLabel(label.parent_label.id)
                } else {
                    return label
                }
            }

            //// sortedLabels
            let sortedLabels = []

            /// ytbDistributors

            for (let release of data.releases) {

                /// Групировка лейблов под родительстким
                let label = state.allLabels.find(item => item.id === release.labelID)
                

                if (label) {
                    let parentLabel = getParentLabel(release.labelID)
                    if (parentLabel) {
                        release.labelParent = parentLabel
                        release.statusDiscogs = parentLabel.status
                        let findIndex = sortedLabels.findIndex(item => item.id === parentLabel.id) 
                        if (findIndex < 0) {
                            parentLabel.count = 1
                            parentLabel.releases = []
                            parentLabel.releases.push(release)
                            sortedLabels.push(parentLabel)
                        } else {
                            sortedLabels[findIndex].count += 1
                            parentLabel.releases.push(release)
                        }
                    }

                } else {
                    //console.log('label not found', release.labelID)
                }

                /// onRevibed count
                if (release.onRevibed) {
                    state.onRevibedCount += 1
                }

                /// youtubeLink, onYoutubeCount
                let youtube = state.youtubes.find(el => el.discogsRelease === release.releaseID)
                if (youtube) {
                    release.youtubeLink = `https://www.youtube.com/watch?v=${youtube.videoId}`
                    state.onYoutubeCount += 1
                } else {
                    if (release.source === 'Anton') {
                        //notOnYoutube.push(release.releaseID)
                    }
                }
                
                /// youtubeCopyrightOwners handle
                if (release.youtubeCopyrightOwners.length) {
                    release.youtubeCopyrightOwnersDistributor = []
                    release.youtubeCopyrightOwnersLabel = []
                    for (let row of release.youtubeCopyrightOwners) {
                        if (row.distributor.length) {
                            for (let item of row.distributor) {
                                release.youtubeCopyrightOwnersDistributor.push(item)
                            }
                            // sortYtbDistributors(release, row.distributor)
                        }

                        if (row.label.length) {
                            for (let item of row.label) {
                                release.youtubeCopyrightOwnersLabel.push(item)
                            }
                        }

                    }
                    release.youtubeCopyrightOwnersDistributor = release.youtubeCopyrightOwnersDistributor.join(', ')
                    release.youtubeCopyrightOwnersLabel = release.youtubeCopyrightOwnersLabel.join(', ')
                    release.statusYoutube = 'warning'
                } else {
                    if (release.youtubeLink) {
                        release.statusYoutube = 'review'
                    } else {
                        release.statusYoutube = 'notUploaded'
                    }
                }

                //// Check Various
                if (release.artist.indexOf('Various') > -1) {
                    release.statusVarious = 'various'
                } else {
                    release.statusVarious = ''
                }

                if (!release.comment) {
                    release.comment = ''
                }

            }
            sortedLabels.sort((a, b) => {
              return b.count - a.count;
            });
            console.log('sortedLabels Done!')
            console.timeEnd("Time 1");

            state.sortedLabels = sortedLabels
            state.allReleases = data.releases
            state.releases = data.releases
   
            state.allDataReady = true
        }

    },
    getters: {
        allDataReady(state) {
            return state.allDataReady
        },
        getLabelsList(state) {
            if (state.sortedLabels.length) {
                let list = state.sortedLabels.map(item => {
                    return { name: item.name, count: item.count, id: item.id, status: item.status }
                })
                // console.log('list ', list)
                return list
            }
        },
        getLabel: state => (id) => {
            if (state.allLabels.length) {
                return state.allLabels.find(item => item.id === +id)
            }
        },
        getAllReleases(state) {
            return state.allReleases
        },
        getReleases: state => (mode) => {
            console.log('getReleases filters ', mode)

            let filters = [...mode]

            if (filters.length) {
                if (filters.indexOf('goodReleases') > -1) {
                    return state.releases.filter(item => item.statusYoutube === 'review' && item.statusDiscogs === 'default' && item.statusVarious !== 'various')
                } else {


                    let filtersFinal, preResult;
                    let indexOnRevibed = filters.indexOf('onRevibed');
                    if (indexOnRevibed > -1) {
                        filters.splice(indexOnRevibed, 1);
                        preResult = state.releases.filter(item => item.onRevibed)
                    } else {
                        preResult = state.releases
                    }
                    // console.log('preResult ', preResult)
                    let filterQuerys = {
                        youtube: item => item.statusYoutube === 'warning',
                        youtube2: item => item.statusYoutube === 'notUploaded',
                        discogs: item => item.statusDiscogs === 'warning',
                        various: item => item.statusVarious === 'various',
                        onRevibed: item => item.onRevibed,
                    }
    
                    if (filters.length) {
                    
                        let conditions = []; 
                        for (let filter of filters) {
                            conditions.push(filterQuerys[filter]);
                        }
        
                        let result = preResult.filter(d => conditions.some(c => c(d)));
                        return result
    
                    } else {
                        return preResult
                    }

                }



            } else {
                console.log('no filter')
                return state.releases
            }            

        },
        // getReleases: state => (mode) => {
            
        //     console.log('getReleases ', mode)
        //     /// 1
        //     if (mode.indexOf('youtube') > -1 &&
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') === -1 && 
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('youtube')
        //         return state.releases.filter(item => item.statusYoutube === 'warning')
        //     } else if (mode.indexOf('youtube') == -1 &&
        //         mode.indexOf('youtube2') > -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') === -1 && 
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('youtube2')
        //         return state.releases.filter(item => item.statusYoutube === 'notUploaded')
        //     } else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') === -1 && 
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('discogs')
        //         return state.releases.filter(item => item.statusDiscogs === 'warning')
        //     } else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') > -1 && 
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('various')
        //         return state.releases.filter(item => item.statusVarious === 'various')
        //     } else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') === -1 && 
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('onRevibed')
        //         return state.releases.filter(item => item.onRevibed)
        //     } 
        //     //// 2
        //     else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') > -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') === -1 &&
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('youtube+youtube2')
        //         return state.releases.filter(item => item.statusYoutube === 'warning' || item.statusYoutube === 'notUploaded')
        //     }  else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') === -1 &&
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('youtube+discogs')
        //         return state.releases.filter(item => item.statusYoutube === 'warning' || item.statusDiscogs === 'warning')
        //     }else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('youtube+various')
        //         return state.releases.filter(item => item.statusYoutube === 'warning' || item.statusVarious === 'various')
        //     } else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') === -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('youtube+onRevibed')
        //         return state.releases.filter(item => item.statusYoutube === 'warning' && item.onRevibed)
        //     } else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') > -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') === -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('youtube2+onRevibed')
        //         return state.releases.filter(item => item.statusYoutube === 'notUploaded' && item.onRevibed)
        //     }
        //     else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') === -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('discogs+onRevibed')
        //         return state.releases.filter(item => item.statusDiscogs === 'warning' && item.onRevibed)
        //     }
        //     else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('various+onRevibed')
        //         return state.releases.filter(item => item.statusVarious === 'various' && item.onRevibed)
        //     }
        //     else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('various+discogs')
        //         return state.releases.filter(item => item.statusDiscogs === 'warning' || item.statusVarious === 'various')
        //     } 
        //     //// 3
        //     else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('various+discogs+onRevibed')
        //         return state.releases.filter(item => item.statusDiscogs === 'warning' || item.statusVarious === 'various' && item.onRevibed)
        //     } 
        //     else if (
        //         mode.indexOf('youtube') === -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('various+discogs+onRevibed')
        //         return state.releases.filter(item => item.statusDiscogs === 'warning' || item.statusVarious === 'various' && item.onRevibed)
        //     } else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('youtube+various+discogs')
        //         return state.releases.filter(item => item.statusYoutube === 'warning' || item.statusDiscogs === 'warning' || item.statusVarious === 'various')
        //     } 
        //     else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') === -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('youtube+discogs+onRevibed')
        //         let onRevibed = state.releases.filter(item => item.onRevibed)
        //         return onRevibed.filter(item => item.statusYoutube === 'warning' || item.statusDiscogs === 'warning')
        //     } else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') === -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('youtube+various+onRevibed')
        //         let onRevibed = state.releases.filter(item => item.onRevibed)
        //         return onRevibed.filter(item => item.statusYoutube === 'warning' || item.statusDiscogs === 'warning')
        //     }
        //     /// 4
        //     else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') > -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') === -1) {
        //         console.log('youtube+youtube2+various+discogs')
        //         return state.releases.filter(item => item.statusYoutube === 'warning' || item.statusDiscogs === 'warning' || item.statusVarious === 'various')
        //     }
        //     else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') === -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('youtube+various+discogs+onRevibed')
        //         let onRevibed = state.releases.filter(item => item.onRevibed)
        //         return onRevibed.filter(item => item.statusYoutube === 'warning' || item.statusDiscogs === 'warning' || item.statusVarious === 'various')
        //     }
        //     /// 5
        //     else if (
        //         mode.indexOf('youtube') > -1 && 
        //         mode.indexOf('youtube2') > -1 && 
        //         mode.indexOf('discogs') > -1 && 
        //         mode.indexOf('various') > -1 &&
        //         mode.indexOf('onRevibed') > -1) {
        //         console.log('youtube+youtube2+various+discogs+onRevibed')
        //         let onRevibed = state.releases.filter(item => item.onRevibed)
        //         return onRevibed.filter(item => item.statusYoutube === 'warning' || item.statusYoutube === 'notUploaded' || item.statusDiscogs === 'warning' || item.statusVarious === 'various')
            
        //     } else if (mode.indexOf('goodReleases') > -1) {
        //         return state.releases.filter(item => item.statusYoutube === 'review' && item.statusDiscogs === 'default' && item.statusVarious !== 'various')
        //     } else {
        //         console.log('default')
        //         return state.releases
        //     }
            
        // },
        getRelease: state => (id) => {
            if (state.releases.length) {
                return state.releases.find(item => item.releaseID === +id)
            }
        },
        getYoutube: state => (id) => {
            if (state.youtubes.length) {
                return state.youtubes.find(item => item.videoId === id)
            }
        },
        getOnYoutubeCount(state) {
            return state.onYoutubeCount
        },
        getOnRevibedCount(state) {
            return state.onRevibedCount
        },
        getYoutubes(state) {
            return state.youtubes
        },
        // getDistributors(state) {
        //     return state.ytbDistributors
        // },
        // getDistributor: state => (id) => {
        //     if (state.ytbDistributors.length) {
        //         return state.ytbDistributors.find(item => item.id === +id)
        //     }
        // },
        getDistributors(state) {
            return state.distributors
        },
        getDistributor: state => (id) => {
            if (state.distributors.length) {
                return state.distributors.find(item => item.id === +id)
            }
        },
    },
    modules: {
    },
    // plugins: [createPersistedState()]


});

function forceFileDownload(response, title) {
    console.log(title)
    const url = window.URL.createObjectURL(new Blob([response]))
    console.log('url ', url)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', title)
    document.body.appendChild(link)
    link.click()
}