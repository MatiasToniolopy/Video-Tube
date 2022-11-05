import { Box, Button, ButtonGroup, Flex, Grid, GridItem, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {IoHome, IoPause, IoPlay, IoTrash} from 'react-icons/io5'
import {FcApproval} from 'react-icons/fc'
import Spinner from './Spinner'
import { deleteVideo, getSpecificVideos, getUserInfo, recommenderFeed } from '../utils/fetchDara'
import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'
import ReactPlayer from 'react-player'
import {MdFastForward, MdForward10, MdFullscreen, MdOutlineReplay10, MdVolumeOff, MdVolumeUp} from 'react-icons/md'
import logo from '../img/logo.png'
import screenfull from 'screenfull'
import HTMLReactParser from 'html-react-parser'
import avatar1 from '../img/avatar1.jpg';
import moment from 'moment/moment'
import {fetchUser} from '../utils/fetchUser'
import RecommendedVideos from './RecommendedVideos'

const format = (seconds) => {
  if(isNaN(seconds)){
    return '00:00'
  }
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds().toString().padStart(2, '0')

  if(hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
  }
  return `${mm}:${ss}`
}

const VideoPinDetail = () => {
  const {videoId} = useParams()
  const [isloading, setIsloading] = useState(false)
  const [videoInfo, setVideoInfo] = useState(null)
  const firestoreDb = getFirestore(firebaseApp)
  const [isPlaying, setisPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [played, setPlayed] = useState(0)
  const [seekend, setSeekend] = useState(false)

  const [userInfo, setUserInfo] = useState(null)
  const [feeds, setFeeds] = useState(null)

  const playerRef = useRef()
  const playerContainer = useRef()

  const [localUser] = fetchUser()

  const navigate = useNavigate()

  const textColor = useColorModeValue("gray.900", "gray.50")

  useEffect(() => {
    if(videoId){
      setIsloading(true)
      getSpecificVideos(firestoreDb, videoId).then(data => {
        setVideoInfo(data)
        recommenderFeed(firestoreDb, data.category, videoId).then(feed => {
          setFeeds(feed)
        })
        getUserInfo(firestoreDb, data.userId).then(data => {
          setUserInfo(data)
        })
        setIsloading(false)
      })
    }
  }, [videoId])

  useEffect(() => {}, [muted, volume, played])

  const onvolumeChange = (e) => {
    setVolume(parseFloat(e / 100))
    e === 0 ? setMuted(true) : setMuted(false)
  }

  const handleFastRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
  }

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
  }

  const handlePlayedProgress = (changeState) => {
    if(!seekend){
      setPlayed(parseFloat(changeState.played / 100) * 100)
    }
  }

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e / 100))
  }

  const onSeekMouseDown = (e) => {
    setSeekend(true)
  }

  const onSeekMouseUp = (e) => {
    setSeekend(false)
    playerRef.current.seekTo(e / 100)
  }

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00'
  const duration = playerRef.current ? playerRef.current.getDuration() : '00:00'

  const elapsedTime = format(currentTime)
  const totalDuration = format(duration)

  const deleteTheVideo = () => {
    setIsloading(true)
    deleteVideo(firestoreDb, videoId)
    navigate('/', {replace: true})
  }

  if(isloading) return <Spinner />

  return (
    <Flex
      width={"full"}
      height="auto"
      justifyContent={"center"}
      alignItems="center"
      direction={"column"}
      py={2}
      px={4}
    >
      <Flex alignItems={"center"} width="full" my={4}>
        <Link to={"/"}>
          <IoHome fontSize={25} />
        </Link>
        <Box width="1px" height={"25px"} bg={"gray.500"} mx={2}></Box>
        <Text
          istruncated="true"
          color={textColor}
          fontWeight="semibold"
          width={"100%"}
        >
          {videoInfo?.title}
        </Text>
      </Flex>

      <Grid templateColumns="repeat(4, 1fr)" gap={2} width="100%">
        <GridItem width={"100%"} colSpan="3">
          <Flex
            width={"full"}
            bg="black"
            position="relative"
            ref={playerContainer}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoInfo?.videoUrl}
              width="100%"
              height={"100%"}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              onProgress={handlePlayedProgress}
            />

            <Flex
              position={"absolute"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              flexDirection="column"
              justifyContent={"space-between"}
              alignItems="center"
              zIndex={1}
              cursor="pointer"
            >
              <Flex
                alignItems={"center"}
                justifyContent="center"
                onClick={() => {
                  setisPlaying(!isPlaying);
                }}
                width="full"
                height="full"
              >
                {!isPlaying && (
                  <IoPlay fontSize={60} color="#f2f2f2" cursor={"pointer"} />
                )}
              </Flex>

              <Flex
                width={"full"}
                alignItems="center"
                direction={"column"}
                px={4}
                bgGradient="linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)"
              >
                <Slider
                  aria-label="slider-ex-4"
                  min={0}
                  max={100}
                  value={played * 100}
                  transition="ease-in-out"
                  transitionDuration={"0.2s"}
                  onChange={handleSeekChange}
                  onMouseDown={onSeekMouseDown}
                  onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack bg="teal.50">
                    <SliderFilledTrack bg="teal.300" />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={3}
                    bg="teal.300"
                    transition="ease-in-out"
                    transitionDuration={"0.2"}
                  />
                </Slider>

                <Flex width={"full"} alignItems="center" my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color={"#f1f1f1"}
                    cursor="pointer"
                    onClick={handleFastRewind}
                  />
                  <Box onClick={() => setisPlaying(!isPlaying)}>
                    {!isPlaying ? (
                      <IoPlay
                        fontSize={30}
                        color={"#f2f2f2"}
                        cursor={"pointer"}
                      />
                    ) : (
                      <IoPause
                        fontSize={30}
                        color={"#f2f2f2"}
                        cursor={"pointer"}
                      />
                    )}
                  </Box>
                  <MdForward10
                    fontSize={30}
                    color={"#f1f1f1"}
                    cursor="pointer"
                    onClick={handleFastForward}
                  />
                  <Flex alignItems={"center"}>
                    <Box onClick={() => setMuted(!muted)}>
                      {!muted ? (
                        <MdVolumeUp
                          fontSize={30}
                          color="#f1f1f1"
                          cursor="pointer"
                        />
                      ) : (
                        <MdVolumeOff
                          fontSize={30}
                          color="#f1f1f1"
                          cursor="pointer"
                        />
                      )}
                    </Box>
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={volume * 100}
                      size="sm"
                      min={0}
                      max={100}
                      width={16}
                      mx={2}
                      onChangeStart={onvolumeChange}
                      onChangeEnd={onvolumeChange}
                    >
                      <SliderTrack bg="teal.50">
                        <SliderFilledTrack bg="teal.300" />
                      </SliderTrack>
                      <SliderThumb boxSize={2} bg="teal.300" />
                    </Slider>
                  </Flex>

                  <Flex alignItems={"center"} gap={2}>
                    <Text fontSize={16} color="whitesmoke">
                      {elapsedTime}
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      /
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      {totalDuration}
                    </Text>
                  </Flex>

                  <Image src={logo} width={"120px"} ml="auto" />
                  <MdFullscreen
                    fontSize={30}
                    color="#f1f1f1"
                    cursor={"pointer"}
                    onClick={() => {
                      screenfull.toggle(playerContainer.current);
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {videoInfo?.description && (
            <Flex my={6} direction="column">
              <Text my={2} fontSize={25} fontWeight="semibold">
                Description
              </Text>
              {HTMLReactParser(videoInfo?.description)}
            </Flex>
          )}
        </GridItem>
        <GridItem width={"100%"} colSpan="1">
          {userInfo && (
            <Flex direction={"column"} width={"full"}>
              <Flex alignItems={"center"} width={"full"}>
                <Image
                  src={userInfo?.photoURL ? userInfo?.photoURL : avatar1}
                  rounded="full"
                  width={"60px"}
                  height={"60px"}
                  minHeight="60px"
                  minWidth={"60px"}
                />

                <Flex direction={"column"} ml={3}>
                  <Flex alignItems={"center"}>
                    <Text
                      istruncated="true"
                      textColor={textColor}
                      fontWeight="semibold"
                    >
                      {userInfo?.displayName}
                    </Text>
                    <FcApproval />
                  </Flex>
                  {videoInfo?.id && (
                    <Text fontSize={12}>
                      {moment(
                        new Date(parseInt(videoInfo.id)).toISOString()
                      ).fromNow()}
                    </Text>
                  )}
                </Flex>
              </Flex>
              <Flex justifyContent={"space-around"} mt={6}>
                {userInfo?.uid === localUser.uid && (
                  <Popover closeOnEsc>
                    <PopoverTrigger>
                      <Button colorScheme={"red"}><IoTrash fontSize={20} color="#fff"/></Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmation!</PopoverHeader>
                      <PopoverBody>
                        Are you sure you want to delete it?
                      </PopoverBody>
                      <PopoverFooter display='flex' justifyContent='flex-end'>
                        <ButtonGroup size='sm'>
                          <Button colorScheme='red' onClick={() => deleteTheVideo(videoId)}>Yes</Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}

                <a
                href={videoInfo.videoUrl}
                download
                onClick={(e) => {e.stopPropagation()}}
                >
                  <Button
                  colorScheme={"whatsapp"}
                  rounded="full"
                  my={2}
                  mt={"0"}
                  >
                    Free Download Now
                  </Button>
                </a>
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>
      {feeds && (
        <Flex direction={"column"} width="full" my={6}>
          <Text my={4} fontSize={25} fontWeight="semibold">
            Recommended Videos
          </Text>
          <RecommendedVideos feeds={feeds}/>
        </Flex>
      )}
    </Flex>
  );
}

export default VideoPinDetail