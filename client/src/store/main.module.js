import axios from 'axios'
import router from '@/router'
import { auth } from "./auth.module";

// const VITE_API_URL = 'http://localhost:3000';
//const import.meta.env.VITE_API_URL = '/api';

/// revibed api key - ozs6tZrfHNCSS4HnfRPvpvgVGbBj2JakfPyEXAtJcXukGNxCouBW2Gs6z7STZEfVyh4Tmg



export const main = {
    state: {
        allLabels: [],
        allReleasesAndNotGoods: [],
        allReleases: [],
        releases: [],
        tracks: [],
        notGoods: [],
        sortedLabels: [],
        youtubes: [],
        onYoutubeCount: 0,
        onRevibedCount: 0,
        ytbDistributors: [],
        distributors: [],
        owners: [],
        artists: [],
        countries: [],
        allDataReady: false,
        filterState: [],
        releasesAdded: [],
        releasesAllStatuses: ['default', 'warning', 'blocked', 'success'],
        releasesAllTypes: ['goods', 'preorder', 'coming_soon', 'allowed_to_buy'],
        releasesAllSources: ['Anton', 'Revibed', 'No'],
        labelsAllStatuses: {
            contact: ['not_contacted', 'contacted', 'refused', 'approved', 'open_to_talk', 'in_negotiation', 'no_contact_available', 'more_info_needed', 'email_bounced', 'reconnect_later'],
            main: ['default', 'warning', 'blocked', 'success'],
            youtube: ['default', 'warning']
        },
        labelFilterStatusContact: 'All',
        labelFilterStatusMain: 'All',
        labelFilterStatusYoutube: 'All',
        labelFilterStatusHasContacts: false,
        labelsFiltersDefault: ['All', 'All', 'All', false, undefined],
        labelsFilters: ['All', 'All', 'All', false, undefined],
        artistsAllStatuses: {
            contact: ['not_contacted', 'contacted', 'refused', 'approved', 'open_to_talk', 'in_negotiation', 'no_contact_available', 'more_info_needed', 'email_bounced', 'reconnect_later'],
            main: ['default', 'warning', 'blocked', 'success'],
            youtube: ['default', 'warning']
        },
        releasesFilter: {
            youtube: false,
            youtube2: false,
            discogs: false,
            various: false,
            onRevibed: false, 
            goodReleases: false,
            addToRVBD: false
        },
        tableState: {
            releases: {
                sortBy: [{ key: "updated", order: "desc" }],
                pageNum: 1
            }, 
            labels: {
                sortBy: [{ key: 'count', order: 'desc' }],
                pageNum: 1
            }, 
        },
    },
    actions: {
        async getRevibedGoods() {
            const response = await axios.get(`/revibed/api/goods?size=4000`);
            return response
        },
        async getYoutubes({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-youtubes`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getLabels({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-labels`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getArtists({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-artists`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getReleases({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-releases`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getTracks({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-tracks`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getDistributors({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-distributors`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getOwners({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-owners`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getCountries({ rootState }) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-countries`, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                },
                params: {
                    token: rootState.auth.token
                }
            });
            return response
        },
        async getAllData ({ state, dispatch, commit, rootState }) {
            console.time("getAllData");

            // console.log('import.meta.env ', import.meta.env.VITE_API_URL) 

            // console.log('rootState ', rootState.auth.user)

            //// check user
            const checkIfUserCan = await dispatch('auth/getuser', {}, {root:true})
            ///const checkIfUserCan = rootState.auth.user
            // console.log('checkIfUserCan ', checkIfUserCan)
            if (!checkIfUserCan.success) return;
            console.log('exp ', new Date (checkIfUserCan.user.exp * 1000))


            /// route
            const route = router.currentRoute._value.name
            //console.log('route ', route)



            // const getRevibedGoodsData = await dispatch('getRevibedGoods')
            // console.log("getRevibedGoodsData response ", getRevibedGoodsData.payload);
            // if (getRevibedGoodsData.success) {
            //     commit('setRevibedGoods', getRevibedGoodsData.data)
            // }

            if (route === 'Home' || route === 'ReleasePage') {

                const getReleasesData = await dispatch('getReleases')
                if (getReleasesData.data.success) {
                    commit('setReleases2', getReleasesData.data)
                }

                console.timeEnd("getAllData");
                state.allDataReady = true

                const getLabelsData = await dispatch('getLabels')
                if (getLabelsData.data.success) {
                    commit('setLabels', getLabelsData.data)
                }

            } else {

                const getLabelsData = await dispatch('getLabels')
                if (getLabelsData.data.success) {
                    commit('setLabels', getLabelsData.data)
                }

                console.timeEnd("getAllData");
                state.allDataReady = true

                const getReleasesData = await dispatch('getReleases')
                //console.log("getReleases response ", getReleasesData.data);
                if (getReleasesData.data.success) {
                    commit('setReleases2', getReleasesData.data)
                }
            }

            //// All the rest in Parallel
            const [
                    getTracksData,    
                    getYoutubesData, 
                    getArtistsData, 
                    getDistributorsData, 
                    getOwnersData, 
                    getCountriesData
                ] = await Promise.all([
                    dispatch('getTracks'),
                    dispatch('getYoutubes'), 
                    dispatch('getArtists'), 
                    dispatch('getDistributors'),
                    dispatch('getOwners'),
                    dispatch('getCountries')
                ]);
            
                if (getTracksData.data.success) {
                    commit('setTracks', getTracksData.data)
                }
                if (getYoutubesData.data.success) {
                    commit('setYoutubes', getYoutubesData.data)
                }
                if (getArtistsData.data.success) {
                    commit('setArtists', getArtistsData.data)
                }
                if (getDistributorsData.data.success) {
                    commit('setDistributors', getDistributorsData.data)
                }
                if (getOwnersData.data.success) {
                    commit('setOwners', getOwnersData.data)
                }
                if (getCountriesData.data.success) {
                    commit('setCountries', getCountriesData.data)
                }



        },

        async addLabel({ state, dispatch }, labelData) {
            state.allDataReady = false
            console.log('labelData ', labelData)
            let label = {
                name: labelData.label.name
            }
            let type = labelData.type

            if (label) {
                if (type === 'labels') {
                    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/add-label/`, { label: label }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    console.log('response after edit: ', data)
                } else if (type === 'distributors') {
                    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/add-distributor/`, { label: label })
                    console.log('response after edit: ', data)
                } else if (type === 'owners') {
                    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/add-owner/`, { label: label })
                    console.log('response after edit: ', data)
                }
            }
            await dispatch('getAllData')
        },
        async editLabel({ state, dispatch, rootState }, labelData) {
            state.allDataReady = false
            /// set user
            let user = rootState.auth.user
            //console.log('labelData ', labelData)
            let label = {
                name: labelData.label.name,
                id: labelData.label.id,
                contacts: labelData.label.contacts,
                status: labelData.label.status,
                statusContact: labelData.label.statusContact,
                parent_label: (labelData.label.parent_label) ? labelData.label.parent_label : null
            }
            let labelID = labelData.label._id
            let type = labelData.type
            ///console.log('labelID ', labelID)
            //console.log('label ', label)

            if (label) {
                if (type === 'labels') {
                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-label/${labelID}`, { label: label, user: user }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    console.log('editLabel response : ', data)
                } else if (type === 'distributors') {
                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-distributor/${labelID}`, { label: label, user: user }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    //console.log('response after edit: ', data)
                } else if (type === 'owners') {
                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-owner/${labelID}`, { label: label, user: user }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    //console.log('response after edit: ', data)
                }
            }
            console.log('getAllData')
            await dispatch('getAllData')
        },
        async editArtist({ state, dispatch, rootState }, artistData) {
            state.allDataReady = false
            console.log('artistData ', artistData)
            let user = rootState.auth.user
            let artist = {
                name: artistData.artist.name,
                id: artistData.artist.id,
                contacts: artistData.artist.contacts,
                status: artistData.artist.status,
                statusContact: artistData.artist.statusContact
            }
            let artistID = artistData.artist._id
            let type = artistData.type
            console.log('artistID ', artistID)
            console.log('artist ', artist)

            if (artist) {
                if (type === 'artists') {
                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-artist/${artistID}`, { artist: artist, user: user }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    console.log('response after edit: ', data)
                } 
            }
            await dispatch('getAllData')
        },
        async removeParentLabel({ state, dispatch }, labelData) {
            state.allDataReady = false
            console.log('labelData ', labelData)
            let label = {
                name: labelData.label.name,
                id: labelData.label.id,
                contacts: labelData.label.contacts,
                status: labelData.label.status,
                statusContact: labelData.label.statusContact,
                parent_label: labelData.label.parent_label
            }
            let labelID = labelData.label._id
            let type = labelData.type
            console.log('labelID ', labelID)
            console.log('label ', label)

            if (label) {
                if (type === 'labels') {
                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/remove-parentlabel/${labelID}`, { label: label }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    console.log('response after edit: ', data)
                } else if (type === 'distributors') {
                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-distributor/${labelID}`, { label: label }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    console.log('response after edit: ', data)
                } else if (type === 'owners') {
                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-owner/${labelID}`, { label: label }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    console.log('response after edit: ', data)
                }
            }
            await dispatch('getAllData')
        },
        async sublabelsStatusUpdate({ state, dispatch }, labelData) {
            state.allDataReady = false
            console.log('labelData ', labelData)
            let label = {
                name: labelData.label.name,
                id: labelData.label.id,
                contacts: labelData.label.contacts,
                status: labelData.label.status,
                statusContact: labelData.label.statusContact,
                parent_label: labelData.label.parent_label
            }
            let type = labelData.type
            console.log('label.id ', label.id)

            if (label) {
                if (type === 'labels') {
                    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/sublabels-status-update/`, { id: label.id }, {
                        headers: {
                            'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                        }
                    })
                    console.log('response after edit: ', data)
                } 
            }
            await dispatch('getAllData')
        },
        async exportLabels({ state, commit }, labels) {
            console.log('exportLabels ', labels)
            const { data } = await axios.post('http://labels.kx-streams.com/api/export-labels/', { labels: labels}, { responseType: "arraybuffer", headers: {
                'x-api-key': 'l74b9ba9qmext9a6ulniigq8'} 
            } )
            console.log('exportLabels response: ', data)
            forceFileDownload(data, 'export-labels.csv')

        },
        async exportReleases({ state, commit }, releases) {
            console.log('exportReleases ', releases)
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/export-releases/`, { releases: releases}, { responseType: "arraybuffer", headers: {
                'x-api-key': 'l74b9ba9qmext9a6ulniigq8'} 
            } )
            console.log('exportReleases response: ', data)
            forceFileDownload(data, 'export-releases.csv')
        },
        async removeFromRevibedMany({ state, commit }, releases) {
            console.log('removeFromRevibedMany ', releases)
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/remove-from-rvbd-many/`, { releases: releases }, {
                headers: {
                    'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                }
            } )
            console.log('removeFromRevibedMany response: ', data)
        },
        async editRelease({ state, dispatch, rootState }, releaseData) {
            console.log('releaseData ', releaseData)
            let user = rootState.auth.user
            let release = releaseData.release

            console.log('editRelease ', release)
            if (release) {
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-release/${release._id}`, {release: release, user: user}, {
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                    }
                })
                //console.log('response after edit: ', data)
                return data
            }
            await dispatch('getAllData')
        },
        async editTrack({ state, dispatch, rootState }, trackData) {
            console.log('trackData ', trackData)
            let user = rootState.auth.user
            let track = trackData.track

            console.log('editTrack ', track)
            if (track) {
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-track/${track._id}`, {track: track, user: user}, {
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                    }
                })
                //console.log('response after edit: ', data)
                return data
            }
            //await dispatch('getAllData')
        },
        async putOnSale({ state, dispatch, rootState }, releaseData) {
            console.log('releaseData ', releaseData)
            let user = rootState.auth.user
            let release = releaseData.release

            console.log('putOnSale ', release)
            if (release) {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/put-on-sale-release/`, {release: release, user: user}, {
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                    }
                })
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
                const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/delete-release/${release.id}`, {
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                    }
                })
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
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-youtube/${youtube.id}`, {youtube: youtube}, {
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                    }
                })
                console.log('response after edit: ', data)
            }
            await dispatch('getAllData')
        },  
        async editDistributor({ state, dispatch }, labelData) {
            let contacts = labelData.label.contacts
            let status = labelData.status
            let labelID = labelData.label._id
            
            if (labelData) {
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-distributor/${labelID}`, { contacts: contacts, status: status}, {
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                    }
                })
                console.log('response after edit: ', data)
            }
            await dispatch('getAllData')
        },
        async editOwner({ state, dispatch }, labelData) {
            let contacts = labelData.label.contacts
            let status = labelData.status
            let labelID = labelData.label._id
            
            if (labelData) {
                const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/edit-owner/${labelID}`, { contacts: contacts, status: status}, {
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'
                    }
                })
                console.log('response after edit: ', data)
            }
            await dispatch('getAllData')
        },
        async checkRelease({ state, commit }, releaseID) {
            console.log('checkRelease ', releaseID)
            try {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/check-release/`, { releaseID: releaseID}, { 
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'} 
                    } )
                console.log('checkRelease response: ', data)
                return data
            } catch (error) {
                console.log('error ', error)
                return error.response.data
            }   

        },
        async addRelease({ state, commit }, releaseData) {
            console.log('addRelease ', releaseData)
            try {
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/add-release/`, releaseData, { 
                    headers: {
                        'x-api-key': 'l74b9ba9qmext9a6ulniigq8'} 
                    } )
                console.log('checkRelease response: ', data)
                return data
            } catch (error) {
                console.log('error ', error)
                return error.response.data
            }   

        },
        
    },
    mutations: {
        setRevibedGoods(state, data) {
            console.log('setRevibedGoods ', data)
        },
        setTracks(state, data) { 
            state.tracks = data.tracks
        },
        setCountries(state, data) { 
            state.countries = data.countries
        },
        setYoutubes(state, data) { 
            state.youtubes = data.youtubes
        },
        setDistributors(state, data) { 
            state.distributors = data.distributors
            console.time("setDistributors");
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
                                        release.statusDistributor = distributor.statusContact
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

            console.timeEnd("setDistributors");

        },
        setOwners(state, data) { 
            state.owners = data.owners
            console.time("setOwners");
            state.owners.map(owner => {
                owner.releases = []
                owner.count = 0
                for (let release of state.releases) {
                    if (release.youtubeCopyrightOwners.length) {
                        for (let row of release.youtubeCopyrightOwners) {
                            if (row.label.length) {
                                for (let item of row.label) {
                                    if (item === owner.name) {
                                        owner.releases.push(release)
                                        owner.count += 1
                                        release.statusOwner = owner.statusContact
                                    }
                                }
                            }
                        }
                    }
                }
                return owner
            })

            state.owners.sort((a, b) => {
                return b.count - a.count;
            });
            console.timeEnd("setOwners");

        },
        setLabels(state, data) { 
            //console.time("setLabels");
            state.allLabels = [...data.labels]
            state.sortedLabels = [...data.labels]

            let labelsSorted = []
            let releasesAdded = []

            data.labels.map(item => {
                releasesAdded = releasesAdded.concat(item.subreleases)
                item.count = item.subreleases.length
                if (item.count) {
                    labelsSorted.push(item)
                }
            })
            data.labels.map(item => {
                let findRel = 0
                item.releases.forEach( el => {
                    let find = releasesAdded.indexOf(el)
                    if (find === -1) {
                        releasesAdded.push(el)
                        findRel += 1
                    }
                })
                if (true) {
                    let index = labelsSorted.findIndex(el => el.id === item.id)
                    if (index === -1) {
                        item.count = findRel
                        labelsSorted.push(item)
                    } else {
                        labelsSorted[index].count += findRel
                    }
                    
                }
            })
            
            state.releasesAdded = releasesAdded
            labelsSorted.sort((a, b) => b.count - a.count);
            state.sortedLabels = labelsSorted
            console.timeEnd("setLabels");
        },
        setReleases2(state, data) { 
            //console.log('setReleases2 ', data.releases[0])
            state.allReleasesAndNotGoods = data.releases.concat(data.notGoods)
            state.allReleases = data.releases
            state.releases = data.releases
            state.onRevibedCount = data.onRevibedCount
            state.onYoutubeCount = data.onYoutubeCount
            state.notGoods = data.notGoods
        },
        setArtists(state, data) {
            data.artists.sort((a, b) => {
                return b.releases.length - a.releases.length;
            });
            state.artists = data.artists
        },
        setFilteredState(state, data) {
            console.log('setFilteredState ', data)
            state.filterState = data
        },
        setTableState(state, data) {
            /// name, type, value
            //console.log('setTableState ', data)
            state.tableState[data.name][data.type] = data.value
        },
        setFilteredState2(state, data) {
            console.log('setFilteredState2 ', data)
            if (data.action === 'add') {
                if (data.value === 'goodReleases' || data.value === 'addToRVBD' || data.value === 'goodButNotFoSale') {
                    state.filterState = []
                }
                state.filterState.push(data.value)
            } else if (data.action === 'remove') {
                let index = state.filterState.indexOf(data.value);
                console.log('index ', index)
                if (index !== -1) {
                state.filterState.splice(index, 1);
                }
            }
            
        },
        resetReleasesFilter1(state, data) {
            state.releasesFilter = {
                youtube: false,
                youtube2: false,
                discogs: false,
                various: false,
                onRevibed: false,
                addToRVBD: false,
                goodButNotFoSale: false,
            }
        },
        resetReleasesFilter2(state, data) {
            state.releasesFilter = {
                youtube: false,
                youtube2: false,
                discogs: false,
                various: false,
                onRevibed: false,
                goodReleases: false,
                goodButNotFoSale: false,
            }
        },
        resetReleasesFilter3(state, data) {
            state.releasesFilter.addToRVBD = false
            state.releasesFilter.goodReleases = false

            let index = state.filterState.indexOf('goodReleases');
            console.log('index ', index)
            if (index !== -1) {
                state.filterState.splice(index, 1);
            }
            let index2 = state.filterState.indexOf('goodButNotFoSale');
            console.log('index2 ', index2)
            if (index2 !== -1) {
                state.filterState.splice(index2, 1);
            }
            let index3 = state.filterState.indexOf('addToRVBD');
            console.log('index3 ', index3)
            if (index3 !== -1) {
                state.filterState.splice(index3, 1);
            }
        },
        resetReleasesFilter4(state, data) {
            state.releasesFilter = {
                youtube: false,
                youtube2: false,
                discogs: false,
                various: false,
                onRevibed: false,
                goodReleases: false,
                addToRVBD: false,
            }
        },
        setReleasesFilter(state, data) {
            console.log('setReleasesFilter ', data)
            state.releasesFilter[data.item] = data.value
            //('state.releasesFilter ', state.releasesFilter)
        },
        setLabelsFilters(state, data) {
            //('setLabelsFilters ', data)
            state.labelFilterStatusContact = data[0]
            state.labelFilterStatusMain = data[1]
            state.labelFilterStatusYoutube = data[2]
            state.labelFilterStatusHasContacts = data[3]
            state.labelsFilters = data
        }

    },
    getters: {
        getAllDataReady(state) {
            return state.allDataReady
        },
        getAllLabelsList(state) {
            return state.allLabels.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                }
            })
        },
        getLabelsList: state => (labelsType) => {
            let query = state.labelsFilters
            // let labelsType = query[query.length-1]
            // query.pop();
            let filters = [...query];
            let conditions = []; 
            //('filters ', filters)
            filters.map((item,index) => {
                if (index == 0) {
                    if (item !== 'All') {
                        conditions.push(el => el.statusContact === item)
                    }
                }
                if (index == 1) {
                    if (item !== 'All') {
                        conditions.push(el => el.status === item)
                    }
                }
                if (index == 2) {
                    if (item !== 'All') {
                        conditions.push(el => el.statusYoutube === item)
                    }
                }
                if (index == 3) {
                    if (item) {
                        conditions.push(el => el.contacts[0])
                    }
                }
            })
            let labelsSource 
            if (labelsType === 'labels') {
                labelsSource = [...state.sortedLabels.filter(item => item.count)]
            } else if (labelsType === 'distributors') {
                labelsSource = [...state.distributors]
            } else if (labelsType === 'owners') {
                labelsSource = [...state.owners]
            }

            if (conditions.length) {
                let result = labelsSource.filter(d => conditions.every(c => c(d)));
                return result
            } else {
                return labelsSource
            }
            
            
            // if (state.sortedLabels.length) {
            //     let result = state.sortedLabels
            //     return result
            // }
        },
        getLabel: state => (id) => {
            if (state.releases.length) {
                let label = state.sortedLabels.find(item => item.id === +id)

                label.subreleases = label.subreleases.map(subr => {
                    let release = state.releases.find(rel => rel.releaseID === subr)
                    if (release) {
                        return release
                    } else {
                        return subr
                    }
                })
                label.releases = label.releases.map (subr => {
                    let release = state.releases.find(rel => rel.releaseID === subr)
                    if (release) {
                        return release
                    } else {
                        return subr
                    }
                })
                return label
            }
        },
        getAllReleases(state) {
            return state.allReleases
        },
        getReleases: state => (mode) => {
            let filters = [...state.filterState]
            console.log('getReleases filters ', filters)
            if (filters.length) {
                if (filters.indexOf('goodReleases') > -1) {
                    return state.releases.filter(item => item.statusMain === 'allowed')
                } else if (filters.indexOf('goodButNotFoSale') > -1) {
                    return state.releases.filter(item => item.statusMain === 'allowed' && !item.onRevibed.forSale)
                } else if ( filters.indexOf('addToRVBD') > -1) {
                    return state.releases.filter(item => 
                        item.statusMain === 'allowed' && 
                        !item.onRevibed.forSale &&
                        !item.onRevibed.id)
                } else {
                    let preResult;
                    let indexOnRevibed = filters.indexOf('onRevibed');
                    if (indexOnRevibed > -1) {
                        filters.splice(indexOnRevibed, 1);
                        preResult = state.releases.filter(item => item.onRevibed.forSale)
                    } else {
                        preResult = state.releases
                    }
                    let findSource = filters.find(item => item.source)
                    let sourceData
                    if (findSource) {
                        sourceData = findSource.source
                        filters = filters.map(item => {
                            if (item.source) {
                                item = 'source'
                            }
                            return item
                        })
                    }
                    let filterQuerys = {
                        youtube: item => item.statusYoutube === 'warning',
                        youtube2: item => item.statusYoutube === 'notUploaded',
                        discogs: item => item.statusDiscogs === 'warning' || item.statusDiscogs === 'blocked',
                        various: item => item.statusVarious === 'various',
                        onRevibed: item => item.onRevibed.forSale,
                        source: item => item.source === sourceData
                    }
                    if (filters.length) {
                        let conditions = []; 
                        for (let filter of filters) {
                            conditions.push(filterQuerys[filter]);
                        }
                        //console.log('conditions ', conditions)
                        let result = preResult.filter(d => conditions.some(c => c(d)));
                        return result
                    } else {
                        return preResult
                    }
                }

            } else {
                //console.log('no filter')
                return state.releases
            }            

        },
        getReleasesNotGoods: state => (mode) => {
            return state.notGoods
        },
        getRelease: state => (id) => {
            if (state.allReleasesAndNotGoods.length) {
                //console.log('getRelease ', state.releases.find(item => item._id === id))
                return state.allReleasesAndNotGoods.find(item => item._id === id)
            }
        },
        getReleaseTracks: state => (id) => {
            if (state.tracks.length) {
                return state.tracks.filter(item => item.releaseID === id).reverse()
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
        getDistributors(state) {
            return state.distributors
        },
        getDistributor: state => (id) => {
            if (state.distributors.length) {
                return state.distributors.find(item => item.id === +id)
            }
        },
        getOwners(state) {
            return state.owners
        },
        getOwner: state => (id) => {
            if (state.owners.length) {
                //console.log('getOwner ', id)
                return state.owners.find(item => item.id === +id)
            }
        },
        getCountriesList(state) {
            return state.countries
        },
        getArtistsList(state) {
            //console.log('state.artists ', state.artists)
            return state.artists
        },
        getArtist: state => (id) => {
            if (state.artists.length) {
                console.log('getOwner ', id)
                let artist = state.artists.find(item => item.id === +id)

                artist.releases = artist.releases.map (item => {
                    let release = state.releases.find(rel => rel.releaseID === item)
                    if (release) {
                        return release
                    } else {
                        return item
                    }
                })

                return artist
            }
        },
        getCountry: state => (id) => {
            if (state.countries.length) {
                let country = state.countries.find(item => item.name === id)
                country.releases = state.releases.filter (item => item.country === id)
                return country
            }
        },
        getAllLabelsStatuses: state => (type, isFilter) => {
            let labels = [...state.labelsAllStatuses[type]]
            if (isFilter) {
                labels.unshift('All')
            }
            // console.log('getAllLabelsStatuses ', labels)
            return labels
        },
        getAllArtistsStatuses: state => (type, isFilter) => {
            let artists = [...state.artistsAllStatuses[type]]
            if (isFilter) {
                artists.unshift('All')
            }
            // console.log('getAllLabelsStatuses ', labels)
            return artists
        },
        getLabelFilterStatusContact(state) {
            return state.labelFilterStatusContact
        },
        getAllReleasesStatuses (state) {
            return state.releasesAllStatuses
        },
        getAllReleasesTypes (state) {
            return state.releasesAllTypes
        },
        getAllReleasesSources (state) {
            return state.releasesAllSources
        },
        getLabelFilterStatusMain(state) {
            return state.labelFilterStatusMain
        },
        getLabelFilterStatusHasContacts(state) {
            return state.labelFilterStatusHasContacts
        },
        getLabelFilterStatusYoutube(state) {
            return state.labelFilterStatusYoutube
        },
        getFilterState(state) {
            return state.filterState
        },
        getTableState: state => (data) => {
            /// data: { name, type }
            //console.log('getTableState ', state.tableState)
            if (data.name) {
                return state.tableState[data.name][data.type]
            }
           
        },
        getFilterStateLabels(state) {
            let result = false
            state.labelsFilters.forEach((el, i) => {
                if (el !== state.labelsFiltersDefault[i]) {
                    result = true
                }
            })
            return result
        },
        getReleasesFilter(state) {
            //console.log('getReleasesFilter ', state.releasesFilter)
            return state.releasesFilter
        }
        
    },
    modules: {
    },
    // plugins: [createPersistedState()]


};

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
function removeDublikatesAndCount(original) {
    const compressed = [];
    // make a copy of the input array
    const copy = original.slice(0);
    // first loop goes over every element
    for (let i = 0; i < original.length; i++) {
      let myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (let w = 0; w < copy.length; w++) {
        if (original[i] == copy[w]) {
          // increase amount of times duplicate is found
          myCount++;
          // sets item to undefined
          delete copy[w];
        }
      }
      if (myCount > 0) {
        const a = new Object();
        a.name = original[i];
        a.count = myCount;
        compressed.push(a);
      }
    }
    return compressed;
  }