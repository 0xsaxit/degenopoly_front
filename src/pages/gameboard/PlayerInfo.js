/* eslint-disable */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
/////   Mui
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { NotificationManager } from 'react-notifications';
////    Action
import { setPlayerInfo, setRollable } from "../../actions/manager";
import { hasEnoughPoly, shortBalance, upgradeFamily } from "../../lib/block";
////    Component
import { InfoTitle, InfoUnit, InfoValue, SectionTitle } from "../StyledComponent";

const ROLL_DURATION = Number(process.env.REACT_APP_ROLL_DURATION)
// const ROLL_DURATION = 10 // 10 seconds
const UPGRADE_FEE = Number(process.env.REACT_APP_UPGRADE_FEE)

const CaseType = [
    "NFT",
    "Start",
    "Farming",
    "Rewards Boost x1.2",
    "Rewards Boost x1.5",
    "DisableRewards",
    "Rewards Boost x1.8"
]

const BoostType = [
    "Rewards Boost x1.2",
    "Rewards Boost x1.5",
    "Rewards Boost x1.8"
]

const TokenType = [
    'None',
    'Rugcity',//------    Case    --------//
    'Honeypot Land',

    'St Exitscam',
    'Devis Asleep',
    'Softrug Boulevard',

    'Shitcoin Paradise',
    'Whitelisted Street',

    'Ponzi Farm',
    'Degen Area',
    'Ape Territory',

    'Ico Graveyard',
    'Dinocoins City',
    'Moonshot Street',

    'Liquidation Park',
    'Gemes Kingdom',

    'Goblin Town',
    '[Redacted]',

    'Brown Family',//------    Family------------//
    'Grey Family',
    'Purple Family',
    'Orange Family',
    'Red Family',
    'Yellow Family',
    'Blue Family'
]

const BrownFamilyType = 18



const NFTViewer = ({ nftData, upgradableCounts }) => {
    const dispatch = useDispatch()
    const wallet = useSelector(state => state.manager.wallet)
    const [upgrading, setUpgrading] = useState(false)
    const [familyType, setFamilyType] = useState(BrownFamilyType)

    useEffect(() => {
        if (upgradableCounts[familyType - BrownFamilyType] === 0) {
            setUpgrading(false)
        }
    }, [upgradableCounts[familyType - BrownFamilyType]])

    const upgrade = async (familyType) => {
        setUpgrading(true)
        setFamilyType(familyType)
        try {
            if (await hasEnoughPoly(wallet, UPGRADE_FEE)) {
                let res = await upgradeFamily(wallet, familyType)
                var audio = new Audio('/static/sound/mint.mp3')
                audio.play()
                if (res) {
                    NotificationManager.success(`Upgraded to ${TokenType[familyType]}`)
                    dispatch(setPlayerInfo(wallet))
                } else {
                    NotificationManager.error(`Upgrade failed`)
                    setUpgrading(false)
                }
            } else {
                NotificationManager.warning(`You don't have enough POLY to upgrade family`)
            }
        } catch (err) {
            console.log(err.message)
            setUpgrading(false)
        }
    }

    return (
        <Stack direction='column' spacing={1} alignItems='center'
            sx={{
                backgroundColor: '#2e2e2e',
                borderRadius: '5px',
            }}>
            <InfoTitle variant="h5">
                - Your NFTs -
            </InfoTitle>
            <TableContainer component={Paper} sx={{ mt: "20px", backgroundColor: '#1a2e4c' }}>
                <Table aria-label="simple table">
                    <TableBody>
                        {nftData?.map(nft => (
                            <TableRow
                                key={nft.tokenType}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'whtie' }}
                            >
                                {/* <TableCell align="left"><img src={`/static/nft/${nft.tokenType - 1}.png`} width="30px" height="30px" /> </TableCell> */}
                                <TableCell align="left" sx={{ padding: '0px' }}>
                                    <InfoTitle variant='body1'>
                                        {`${TokenType[nft.tokenType]}`}
                                    </InfoTitle>
                                </TableCell>
                                <TableCell align="left" sx={{ fontFamily: "Comfortaa", color: "white", padding: '0px' }}>
                                    <InfoValue variant="h6">
                                        {`x ${nft.count}`}
                                    </InfoValue>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Stack direction='column'> */}
            {
                upgradableCounts?.map((item, index) => {
                    if (item > 0) {
                        return <LoadingButton loading={upgrading} loadingPosition='start' startIcon={<></>} variant='contained' key={index} sx={{ fontSize:'24px' }} onClick={e => upgrade(BrownFamilyType + index)}>
                            {`Upgrade to ${TokenType[BrownFamilyType + index]} x${item}`}
                        </LoadingButton>
                    } else {
                        <></>
                    }
                }
                )
            }
            {/* </Stack> */}
        </Stack>
    )
}

export default function PlayerInfo() {
    const dispatch = useDispatch()
    const player = useSelector(state => state.manager.player)

    const [counter, setCounter] = useState()
    const [rollCounter, setRollCounter] = useState(null)
    const [disableCounter, setDisableCounter] = useState(null)
    const [boostCounters, setBoostCounters] = useState([])

    useEffect(() => {
        // if (player.lastRollTime) {
        if (counter) {
            clearInterval(counter)
        }
        setCounter(setInterval(() => setNewTime(), 1000));
        return () => clearInterval(counter);
        // }
    }, [player.lastRollTime, player.boostRewards?.length, player.disableStartTime])

    const setNewTime = () => {
        ///     roll counter
        {
            const startTime = new Date((player.lastRollTime + ROLL_DURATION) * 1000);
            const endTime = new Date();
            const distanceToNow = startTime - endTime;

            if (distanceToNow > 0) {
                const getHours = `0${Math.floor((distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2);
                const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);
                const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

                setRollCounter({
                    hours: getHours || '000',
                    minutes: getMinutes || '000',
                    seconds: getSeconds || '000'
                });
            } else {
                dispatch(setRollable(true))
                setRollCounter(null)
            }
        }
        // disable counter
        {
            const startTime = new Date((player.disableStartTime + player.disableRemainTime) * 1000);
            const endTime = new Date();
            const distanceToNow = startTime - endTime;

            if (distanceToNow > 0) {
                const getHours = `0${Math.floor((distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2);
                const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);
                const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

                setDisableCounter({
                    hours: getHours || '000',
                    minutes: getMinutes || '000',
                    seconds: getSeconds || '000'
                });
            } else {
                setDisableCounter(null)
            }
        }
        // Boost counter
        {
            let counters = []
            for (let i = 0; i < player.boostRewards?.length / 3; i++) {
                const startTime = new Date((player.boostRewards[i * 3 + 1] + player.boostRewards[i * 3 + 2]) * 1000);
                const endTime = new Date();
                const distanceToNow = startTime - endTime;

                if (distanceToNow > 0) {
                    const getHours = `0${Math.floor((distanceToNow % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}`.slice(-2);
                    const getMinutes = `0${Math.floor((distanceToNow % (1000 * 60 * 60)) / (1000 * 60))}`.slice(-2);
                    const getSeconds = `0${Math.floor((distanceToNow % (1000 * 60)) / 1000)}`.slice(-2);

                    counters.push({
                        hours: getHours || '000',
                        minutes: getMinutes || '000',
                        seconds: getSeconds || '000'
                    });
                } else {
                    counters.push({
                        hours: '0',
                        minutes: '0',
                        seconds: '0'
                    });
                }
            }
            setBoostCounters(counters)
        }
    };

    return (
        <Stack direction='column' spacing={2}>
            <Stack direction='row'>
                <Stack direction='column' sx={{ width: { md: '48%', xs: '100%' }, mx: '1%', px: '1%', borderRadius: '5px', background: '#92cbc4' }}> 
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
                        <SectionTitle variant='h6'>
                            User Statistics
                        </SectionTitle>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            $DPOLY Balance:
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant='h10'>
                                {`${shortBalance(player?.polyBalance)}`}
                            </InfoValue>
                            <InfoUnit variant='h10'>
                                {` $POLY`}
                            </InfoUnit>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Daily Rewards: `}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                {`${shortBalance(player?.rewardClaimed)}`}
                            </InfoValue>
                            <InfoUnit variant='h10'>
                                {` $POLY`}
                            </InfoUnit>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Current bonus/malus: `}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                {`${shortBalance(player?.dailyRewards)}`}
                            </InfoValue>
                            <InfoUnit variant='h10'>
                                {` $POLY`}
                            </InfoUnit>

                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Claimable $DPOLY: `}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>

                            <InfoValue variant="h10">
                                {`${shortBalance(player?.claimableRewards)}`}
                            </InfoValue>
                            <InfoUnit variant='h10'>
                                {` $POLY`}
                            </InfoUnit>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction='column' sx={{ width: { md: '48%', xs: '100%' }, mx: '1%', px: '1%', borderRadius: '5px', background: '#92cbc4' }}> 
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
                        <SectionTitle variant='h6'>
                            NFT Owned
                        </SectionTitle>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Rugcity:`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`HoneyPot Land:`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Saint ExitScam:`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`DAO Hideout:`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Liquidation Park:`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Moonshot street:`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Ponzi Farm:`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction='row'>
                <Stack direction='column' sx={{ width: { md: '48%', xs: '100%' }, mx: '1%', px: '1%', borderRadius: '5px', background: '#92cbc4' }}> 
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
                        <SectionTitle variant='h6'>
                            Mint Family
                        </SectionTitle>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Available Mints :`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                100
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <LoadingButton loading={false} loadingPosition='start' startIcon={<></>} variant='contained' color='error' size='large' disabled={false} sx={{ width: '100%', fontSize:'18px'  }}>Mint Family</LoadingButton>
                    </Stack>
                </Stack>

                <Stack direction='column' sx={{ width: { md: '48%', xs: '100%' }, mx: '1%', px: '1%', borderRadius: '5px', background: '#92cbc4' }}> 
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='center'>
                        <SectionTitle variant='h6'>
                            Family Owned
                        </SectionTitle>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Jeet :`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Pleb :`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`Lurker :`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
                        <InfoTitle variant='h10'>
                            {`OG :`}
                        </InfoTitle>
                        <Stack direction='row' spacing={1}>
                            <InfoValue variant="h10">
                                x1
                            </InfoValue>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            {/* <NFTViewer nftData={Array.isArray(player.nfts) ? player.nfts : []} upgradableCounts={player.upgradableCounts} /> */}
        </Stack >
    )
}