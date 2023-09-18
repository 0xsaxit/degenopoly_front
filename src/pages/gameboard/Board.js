/* eslint-disable */
import React, { useState } from 'react';

import { Box, Stack } from '@mui/material';

import { useSelector } from 'react-redux';
import Property from './Property';

var Total_Props_Count = 24

var properties = [
    { src: '/static/property/start.svg', nftType: 0 },
    { src: '/static/property/indian_jeet_city.svg', nftType: 1 },
    { src: '/static/property/event.svg', nftType: 0 },
    { src: '/static/property/honeypot_land.svg', nftType: 2 },
    { src: '/static/property/st_exitscam.svg', nftType: 3 },
    { src: '/static/property/rugs_riches.svg', nftType: 4 },
    { src: '/static/property/softrug_boulevard.svg', nftType: 5 },
    { src: '/static/property/event.svg', nftType: 0 },
    { src: '/static/property/shitcoin_paradise.svg', nftType: 6 },
    { src: '/static/property/pleb_vcc.svg', nftType: 7 },
    { src: '/static/property/ponzi_farm.svg', nftType: 8 },
    { src: '/static/property/ser_castle.svg', nftType: 9 },
    { src: '/static/property/ape_territory.svg', nftType: 10 },
    { src: '/static/property/event.svg', nftType: 0 },
    { src: '/static/property/ico_graveyard.svg', nftType: 11 },
    { src: '/static/property/dinocoins_city.svg', nftType: 12 },
    { src: '/static/property/moonshot_street.svg', nftType: 13 },
    { src: '/static/property/event.svg', nftType: 0 },
    { src: '/static/property/liquidation_park.svg', nftType: 14 },
    { src: '/static/property/dev_wallet.svg', nftType: 0 },
    { src: '/static/property/gems_kingdom.svg', nftType: 15 },
    { src: '/static/property/event.svg', nftType: 0 },
    { src: '/static/property/alphas_heaven.svg', nftType: 16 },
    { src: '/static/property/the_citadel.svg', nftType: 17 }
]

var top_prop_ids = [12, 13, 14, 15, 16, 17, 18, 19]
var left_prop_ids = [11, 10, 9, 8]
var right_prop_ids = [20, 21, 22, 23]
var bottom_prop_ids = [7, 6, 5, 4, 3, 2, 1, 0]

export default function Board({ curPos, onChoose }) {
    const [statProps, setStatProps] = useState(properties)
    const player = useSelector(state => state.manager.player)

    // useEffect(() => {
    //     doDiceRef.current = doDice
    // }, [])

    const getNFTCount = (nftType) => {
        let nfts = player?.nfts
        if (Array.isArray(nfts)) {
            let nft = nfts?.find(nft => nft.tokenType === nftType)
            return nft ? nft.count : 0
        } else {
            return 0
        }
    }


    return (
        <Stack direction='column' spacing={1} sx={{ width: '100%' }}>
            <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
                {
                    top_prop_ids.map((item, index) => (
                        <Property width='12.5%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                    ))
                }
            </Stack>
            <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
                <Stack direction='column' spacing={1} sx={{ width: '12%' }}>
                    {
                        left_prop_ids.map((item, index) => (
                            <Property height='25%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                        ))
                    }
                </Stack>
                <Stack sx={{ width: '77%', height: '100%' }}>
                    <Box component='img' src='/static/center.png' />
                </Stack>
                <Stack direction='column' spacing={1} sx={{ width: '12%' }}>
                    {
                        right_prop_ids.map((item, index) => (
                            <Property height='25%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                        ))
                    }
                </Stack>
            </Stack>
            <Stack direction='row' spacing={1} sx={{ width: '100%' }}>
                {
                    bottom_prop_ids.map((item, index) => (
                        <Property width='12.5%' bg={statProps[item].src} landed={item === curPos} pos={item} key={item} count={getNFTCount(statProps[item].nftType)} onChoose={onChoose} />
                    ))
                }
            </Stack>
        </Stack>
    )
}