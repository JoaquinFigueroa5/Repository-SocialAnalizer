"use client"

import { useState } from "react"
import {
    Box,
    Container,
    VStack,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Text,
    Avatar,
    Badge,
    Card,
    CardBody,
    CardHeader,
    Heading,
    SimpleGrid,
    Spinner,
    useColorModeValue,
    Icon,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    useToast,
    Center,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Link,
    Progress,
    Flex,
} from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchIcon, ExternalLinkIcon } from "@chakra-ui/icons"
import {
    FiMapPin,
    FiGithub,
    FiUsers,
    FiCheckCircle,
    FiAlertCircle,
    FiGlobe,
    FiTrendingUp,
    FiActivity,
    FiEye,
    FiTarget,
    FiLayers,
} from "react-icons/fi"
import useSocialAnalizer from "../shared/hooks/useSocialAnalizer"

// Crear componentes motion con Chakra UI
const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionFlex = motion(Flex)

const UserSearchComponent = () => {
    const [formData, setFormData] = useState({
        username: "",
    })
    const [searchResults, setSearchResults] = useState(null)
    const [searched, setSearched] = useState(false)
    const { metadata, fetchMetadata, loading, error } = useSocialAnalizer()
    const toast = useToast()

    // Nueva paleta de colores sofisticada
    const colors = {
        primary: "#025E73", // Azul petróleo profundo
        secondary: "#011F26", // Azul marino muy oscuro
        accent: "#F2A71B", // Naranja dorado vibrante
        neutral1: "#A5A692", // Gris verdoso suave
        neutral2: "#BFB78F", // Beige cálido
    }

    const bgGradient = useColorModeValue(
        `radial-gradient(circle at 30% 20%, ${colors.neutral2}15 0%, ${colors.neutral1}08 35%, transparent 70%), linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%)`,
        `radial-gradient(circle at 30% 20%, ${colors.primary}25 0%, ${colors.secondary}40 35%, ${colors.secondary} 70%), linear-gradient(135deg, ${colors.secondary} 0%, #000810 100%)`
    )
    
    const cardBg = useColorModeValue(
        "rgba(255, 255, 255, 0.95)",
        `rgba(${parseInt(colors.secondary.slice(1, 3), 16)}, ${parseInt(colors.secondary.slice(3, 5), 16)}, ${parseInt(colors.secondary.slice(5, 7), 16)}, 0.95)`
    )
    
    const glassBg = useColorModeValue(
        "rgba(255, 255, 255, 0.85)",
        "rgba(1, 31, 38, 0.85)"
    )
    
    const borderColor = useColorModeValue(colors.neutral1 + "40", colors.primary + "60")
    const textPrimary = useColorModeValue(colors.secondary, "#ffffff")
    const textSecondary = useColorModeValue(colors.neutral1, colors.neutral2)

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        if (!formData.username.trim()) {
            toast({
                title: "Campo requerido",
                description: "Por favor ingresa un nombre de usuario para buscar",
                status: "warning",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        try {
            const dataToSend = {
                username: formData.username.trim(),
            }

            const response = await fetchMetadata(dataToSend)
            console.log("Response completo:", response)

            const detectedPlatforms = response?.data?.detected || response?.detected || []
            console.log("Plataformas detectadas:", detectedPlatforms)

            setSearchResults(detectedPlatforms)
            setSearched(true)

            if (detectedPlatforms && detectedPlatforms.length > 0 && !error) {
                toast({
                    title: "Búsqueda completada",
                    description: `Se encontraron ${detectedPlatforms.length} plataformas para "${formData.username}"`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch (err) {
            console.error("Error en la búsqueda:", err)
            setSearchResults(null)
            setSearched(true)
        }
    }

    const getPlatformIcon = (link) => {
        const url = link.toLowerCase()
        if (url.includes("github")) return FiGithub
        if (url.includes("facebook")) return FiUsers
        if (url.includes("telegram")) return FiActivity
        if (url.includes("dailymotion")) return FiActivity
        if (url.includes("chess")) return FiActivity
        if (url.includes("pinterest")) return FiActivity
        if (url.includes("reddit")) return FiActivity
        if (url.includes("steam")) return FiActivity
        if (url.includes("scratch")) return FiActivity
        if (url.includes("vk")) return FiUsers
        return FiGlobe
    }

    const getPlatformName = (link) => {
        const url = new URL(link)
        const hostname = url.hostname.replace("www.", "")
        return hostname.split(".")[0].charAt(0).toUpperCase() + hostname.split(".")[0].slice(1)
    }

    const getGeneralStats = (results) => {
        if (!results || !Array.isArray(results)) return null

        const totalPlatforms = results.length
        const countries = [...new Set(results.map((r) => r.country).filter(Boolean))]
        const languages = [...new Set(results.map((r) => r.language).filter(Boolean))]
        const averageRank = results.reduce((sum, r) => sum + (r.rank || 0), 0) / totalPlatforms

        return {
            totalPlatforms,
            countries: countries.length,
            languages: languages.length,
            averageRank: Math.round(averageRank),
            topCountry: countries[0] || "No especificado",
            goodStatus: results.filter((r) => r.status === "good").length,
        }
    }

    // Variantes de animación mejoradas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            rotateX: -15,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.6,
            },
        },
        hover: {
            y: -12,
            scale: 1.03,
            rotateX: 5,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
            },
        },
    }

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    }

    const generalStats = searchResults ? getGeneralStats(searchResults) : null

    return (
        <Box minH="100vh" bg={"blackAlpha.800"} py={12} position="relative" overflow="hidden">
            {/* Elementos decorativos de fondo */}
            <MotionBox
                position="absolute"
                top="10%"
                right="10%"
                w="300px"
                h="300px"
                borderRadius="full"
                bg={'whiteAlpha.300'}
                variants={floatingVariants}
                animate="animate"
                zIndex={0}
                filter="blur(100px)"
            />
            <MotionBox
                position="absolute"
                bottom="20%"
                left="5%"
                w="200px"
                h="200px"
                borderRadius="full"
                bg={'whiteAlpha.500'}
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: "3s" }}
                zIndex={0}
                filter="blur(80px)"
            />

            <Container maxW="8xl" position="relative" zIndex={1}>
                <VStack spacing={12}>
                    {/* Header mejorado */}
                    <MotionBox
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        textAlign="center"
                    >
                        <MotionBox
                            bg={"whiteAlpha.900"}
                            backdropFilter="blur(20px)"
                            borderRadius="3xl"
                            p={8}
                            border="1px solid"
                            borderColor={borderColor}
                            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        >
                            <Flex align="center" justify="center" mb={6}>
                                <Box
                                    p={4}
                                    borderRadius="2xl"
                                    bg={`linear-gradient(135deg, ${colors.primary}, ${colors.accent})`}
                                    mr={4}
                                    boxShadow="0 10px 25px rgba(2, 94, 115, 0.3)"
                                >
                                    <Icon as={FiLayers} boxSize={8} color="white" />
                                </Box>
                                <VStack align="start" spacing={1}>
                                    <Heading 
                                        size="2xl" 
                                        bgGradient={`linear(to-r, ${colors.primary}, ${colors.accent})`}
                                        bgClip="text" 
                                        fontWeight="800"
                                        letterSpacing="-0.02em"
                                    >
                                        Social Analyzer
                                    </Heading>
                                    <Text color={textSecondary} fontSize="lg" fontWeight="500">
                                        Descubre la huella digital completa
                                    </Text>
                                </VStack>
                            </Flex>
                            <Text color={textSecondary} fontSize="md" maxW="2xl" mx="auto" lineHeight={1.6}>
                                Analiza la presencia digital de usuarios en múltiples plataformas con tecnología avanzada de reconocimiento
                            </Text>
                        </MotionBox>
                    </MotionBox>

                    {/* Search Form mejorado */}
                    <MotionBox
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        w="full"
                        maxW="xl"
                    >
                        <Card 
                            bg={'whiteAlpha.900'} 
                            backdropFilter="blur(20px)"
                            shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
                            borderRadius="3xl" 
                            border="2px solid" 
                            borderColor={borderColor}
                            overflow="hidden"
                        >
                            <CardBody p={10}>
                                <form onSubmit={handleSearch}>
                                    <VStack spacing={6}>
                                        <InputGroup size="lg">
                                            <InputLeftElement pointerEvents="none" h="full">
                                                <Box p={2} borderRadius="lg" bg={colors.primary + "15"}>
                                                    <SearchIcon color={colors.primary} boxSize={5} />
                                                </Box>
                                            </InputLeftElement>
                                            <Input
                                                name="username"
                                                placeholder="Ingresa el nombre de usuario a analizar..."
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                borderRadius="2xl"
                                                border="2px solid"
                                                borderColor={borderColor}
                                                focusBorderColor={colors.primary}
                                                _hover={{ 
                                                    borderColor: colors.primary + "80",
                                                    transform: "translateY(-1px)",
                                                    shadow: "lg"
                                                }}
                                                bg={useColorModeValue("white", colors.secondary + "40")}
                                                color={textPrimary}
                                                fontSize="lg"
                                                h="60px"
                                                pl="70px"
                                                _placeholder={{ color: textSecondary + "80" }}
                                                transition="all 0.3s ease"
                                            />
                                        </InputGroup>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            width="full"
                                            h="60px"
                                            bg={`linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`}
                                            color="white"
                                            _hover={{
                                                bg: `linear-gradient(135deg, ${colors.primary}dd 0%, ${colors.accent}dd 100%)`,
                                                transform: "translateY(-3px)",
                                                shadow: "0 20px 40px rgba(2, 94, 115, 0.4)",
                                            }}
                                            _active={{
                                                transform: "translateY(-1px)",
                                            }}
                                            borderRadius="2xl"
                                            isLoading={loading}
                                            loadingText="Analizando..."
                                            transition="all 0.3s ease"
                                            disabled={loading}
                                            fontWeight="700"
                                            fontSize="lg"
                                            boxShadow="0 10px 25px rgba(2, 94, 115, 0.3)"
                                        >
                                            <Icon as={FiTarget} mr={3} boxSize={5} />
                                            Iniciar Análisis Digital
                                        </Button>
                                    </VStack>
                                </form>
                            </CardBody>
                        </Card>
                    </MotionBox>

                    {/* Loading State mejorado */}
                    <AnimatePresence>
                        {loading && (
                            <MotionBox 
                                initial={{ opacity: 0, scale: 0.8 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card bg={"whiteAlpha.900"} backdropFilter="blur(20px)" borderRadius="2xl" p={8} border="1px solid" borderColor={borderColor}>
                                    <VStack spacing={6}>
                                        <Box position="relative">
                                            <Spinner 
                                                size="xl" 
                                                color={colors.primary} 
                                                thickness="4px"
                                                speed="0.8s"
                                            />
                                            <Box
                                                position="absolute"
                                                top="50%"
                                                left="50%"
                                                transform="translate(-50%, -50%)"
                                                w="60px"
                                                h="60px"
                                                borderRadius="full"
                                                bg={colors.accent + "20"}
                                                animation="pulse 2s infinite"
                                            />
                                        </Box>
                                        <VStack spacing={2}>
                                            <Text color={textPrimary} fontWeight="600" fontSize="lg">
                                                Analizando presencia digital...
                                            </Text>
                                            <Text fontSize="sm" color={textSecondary}>
                                                Escaneando múltiples plataformas sociales y bases de datos
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </Card>
                            </MotionBox>
                        )}
                    </AnimatePresence>

                    {/* Error State mejorado */}
                    <AnimatePresence>
                        {error && searched && !loading && (
                            <MotionBox
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                w="full"
                                maxW="lg"
                            >
                                <Alert 
                                    status="error" 
                                    borderRadius="2xl" 
                                    bg={"whiteAlpha.900"}
                                    backdropFilter="blur(20px)"
                                    borderColor="#e53e3e40" 
                                    border="2px solid"
                                    p={6}
                                    boxShadow="0 10px 25px rgba(229, 62, 62, 0.2)"
                                >
                                    <AlertIcon color="#e53e3e" boxSize={6} />
                                    <Box ml={3}>
                                        <AlertTitle color={textPrimary} fontSize="lg" fontWeight="600">
                                            Error en la búsqueda
                                        </AlertTitle>
                                        <AlertDescription color={textSecondary} fontSize="md">
                                            {error || `No se pudo encontrar información para "${formData.username}"`}
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            </MotionBox>
                        )}
                    </AnimatePresence>

                    {/* Results mejorados */}
                    <AnimatePresence>
                        {searched && !loading && !error && searchResults && searchResults.length > 0 && (
                            <MotionBox variants={containerVariants} initial="hidden" animate="visible" w="full">
                                {/* Summary Card mejorado */}
                                {generalStats && (
                                    <MotionCard
                                        variants={cardVariants}
                                        bg={"whiteAlpha.900"}
                                        backdropFilter="blur(20px)"
                                        shadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                        borderRadius="3xl"
                                        border="2px solid"
                                        borderColor={borderColor}
                                        mb={10}
                                        overflow="hidden"
                                        position="relative"
                                    >
                                        {/* Gradient accent */}
                                        <Box
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            right={0}
                                            h="6px"
                                            bg={`linear-gradient(90deg, ${colors.primary}, ${colors.accent}, ${colors.primary})`}
                                        />
                                        
                                        <CardHeader p={8}>
                                            <HStack spacing={6} align="center">
                                                <Box position="relative">
                                                    <Avatar 
                                                        size="2xl" 
                                                        name={formData.username} 
                                                        bg={`linear-gradient(135deg, ${colors.primary}, ${colors.accent})`}
                                                        color="white"
                                                        fontWeight="bold"
                                                        fontSize="2xl"
                                                    />
                                                    <Box
                                                        position="absolute"
                                                        bottom="-2px"
                                                        right="-2px"
                                                        w="24px"
                                                        h="24px"
                                                        borderRadius="full"
                                                        bg={colors.accent}
                                                        display="flex"
                                                        align="center"
                                                        justify="center"
                                                        border="3px solid white"
                                                    >
                                                        <Icon as={FiCheckCircle} boxSize={3} color="white" />
                                                    </Box>
                                                </Box>
                                                <VStack align="start" spacing={2} flex={1}>
                                                    <Heading size="xl" color={textPrimary} fontWeight="700">
                                                        @{formData.username}
                                                    </Heading>
                                                    <HStack spacing={2}>
                                                        <Badge
                                                            bg={colors.accent}
                                                            color="white"
                                                            borderRadius="full"
                                                            px={4}
                                                            py={1}
                                                            fontWeight="600"
                                                            fontSize="sm"
                                                        >
                                                            {generalStats.totalPlatforms} plataformas detectadas
                                                        </Badge>
                                                        <Badge
                                                            bg={colors.primary + "20"}
                                                            color={colors.primary}
                                                            borderRadius="full"
                                                            px={4}
                                                            py={1}
                                                            fontWeight="600"
                                                            fontSize="sm"
                                                        >
                                                            Análisis completo
                                                        </Badge>
                                                    </HStack>
                                                </VStack>
                                            </HStack>
                                        </CardHeader>
                                        <CardBody pt={0} p={8}>
                                            <StatGroup>
                                                <Stat textAlign="center">
                                                    <Box 
                                                        p={4} 
                                                        borderRadius="xl" 
                                                        bg={colors.primary + "10"} 
                                                        mb={3}
                                                        border="1px solid"
                                                        borderColor={colors.primary + "20"}
                                                    >
                                                        <Icon as={FiLayers} boxSize={6} color={colors.primary} mb={2} />
                                                        <StatNumber fontSize="3xl" color={colors.primary} fontWeight="800">
                                                            {generalStats.totalPlatforms}
                                                        </StatNumber>
                                                        <StatLabel fontSize="sm" color={textSecondary} fontWeight="600">
                                                            Plataformas
                                                        </StatLabel>
                                                    </Box>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <Box 
                                                        p={4} 
                                                        borderRadius="xl" 
                                                        bg={colors.accent + "10"} 
                                                        mb={3}
                                                        border="1px solid"
                                                        borderColor={colors.accent + "20"}
                                                    >
                                                        <Icon as={FiMapPin} boxSize={6} color={colors.accent} mb={2} />
                                                        <StatNumber fontSize="3xl" color={colors.accent} fontWeight="800">
                                                            {generalStats.countries}
                                                        </StatNumber>
                                                        <StatLabel fontSize="sm" color={textSecondary} fontWeight="600">
                                                            Países
                                                        </StatLabel>
                                                    </Box>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <Box 
                                                        p={4} 
                                                        borderRadius="xl" 
                                                        bg={colors.neutral1 + "20"} 
                                                        mb={3}
                                                        border="1px solid"
                                                        borderColor={colors.neutral1 + "30"}
                                                    >
                                                        <Icon as={FiGlobe} boxSize={6} color={colors.neutral1} mb={2} />
                                                        <StatNumber fontSize="3xl" color={colors.neutral1} fontWeight="800">
                                                            {generalStats.languages}
                                                        </StatNumber>
                                                        <StatLabel fontSize="sm" color={textSecondary} fontWeight="600">
                                                            Idiomas
                                                        </StatLabel>
                                                    </Box>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <Box 
                                                        p={4} 
                                                        borderRadius="xl" 
                                                        bg={colors.neutral2 + "20"} 
                                                        mb={3}
                                                        border="1px solid"
                                                        borderColor={colors.neutral2 + "30"}
                                                    >
                                                        <Icon as={FiCheckCircle} boxSize={6} color={colors.neutral2} mb={2} />
                                                        <StatNumber fontSize="3xl" color={colors.neutral2} fontWeight="800">
                                                            {generalStats.goodStatus}
                                                        </StatNumber>
                                                        <StatLabel fontSize="sm" color={textSecondary} fontWeight="600">
                                                            Verificados
                                                        </StatLabel>
                                                    </Box>
                                                </Stat>
                                            </StatGroup>
                                        </CardBody>
                                    </MotionCard>
                                )}

                                {/* Platform Cards mejoradas */}
                                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8}>
                                    {searchResults.map((platform, index) => (
                                        <MotionCard
                                            key={index}
                                            variants={cardVariants}
                                            whileHover="hover"
                                            bg={'whiteAlpha.900'}
                                            backdropFilter="blur(20px)"
                                            shadow="0 10px 30px rgba(0, 0, 0, 0.15)"
                                            borderRadius="2xl"
                                            border="2px solid"
                                            borderColor={borderColor}
                                            overflow="hidden"
                                            position="relative"
                                            cursor="pointer"
                                        >
                                            {/* Status gradient indicator */}
                                            <Box
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                h="4px"
                                                bg={platform.status === "good" 
                                                    ? `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` 
                                                    : `linear-gradient(90deg, ${colors.neutral1}, ${colors.neutral2})`}
                                            />

                                            <CardHeader p={6}>
                                                <VStack spacing={4} align="center">
                                                    <Box 
                                                        p={4} 
                                                        borderRadius="2xl" 
                                                        bg={platform.status === "good" 
                                                            ? `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}10)` 
                                                            : `linear-gradient(135deg, ${colors.neutral1}15, ${colors.neutral2}10)`}
                                                        border="2px solid" 
                                                        borderColor={platform.status === "good" ? colors.primary + "30" : colors.neutral1 + "30"}
                                                        position="relative"
                                                        transition="all 0.3s ease"
                                                        _hover={{
                                                            transform: "rotate(5deg) scale(1.1)",
                                                            borderColor: platform.status === "good" ? colors.accent : colors.neutral2
                                                        }}
                                                    >
                                                        <Icon as={getPlatformIcon(platform.link)} boxSize={8} color={platform.status === "good" ? colors.primary : colors.neutral1} />
                                                        <Box
                                                            position="absolute"
                                                            top="-2px"
                                                            right="-2px"
                                                            w="20px"
                                                            h="20px"
                                                            borderRadius="full"
                                                            bg={platform.status === "good" ? colors.accent : colors.neutral2}
                                                            display="flex"
                                                            align="center"
                                                            justify="center"
                                                        >
                                                            <Icon as={FiEye} boxSize={3} color="white" />
                                                        </Box>
                                                    </Box>
                                                    <VStack spacing={1} textAlign="center">
                                                        <Heading size="md" color={textPrimary} fontWeight="700">
                                                            {platform.title || getPlatformName(platform.link)}
                                                        </Heading>
                                                        <Text color={textSecondary} fontSize="sm" fontWeight="500">
                                                            {platform.type || "Plataforma Social"}
                                                        </Text>
                                                        <Badge
                                                            bg={platform.status === "good" ? colors.accent : colors.neutral1}
                                                            color="white"
                                                            borderRadius="full"
                                                            px={3}
                                                            py={1}
                                                            fontWeight="700"
                                                            fontSize="xs"
                                                            textTransform="uppercase"
                                                            letterSpacing="0.5px"
                                                        >
                                                            {platform.status}
                                                        </Badge>
                                                    </VStack>
                                                </VStack>
                                            </CardHeader>

                                            <CardBody pt={0} p={6}>
                                                <VStack spacing={5}>
                                                    {/* Match Rate Progress mejorado */}
                                                    <Box w="full">
                                                        <HStack justify="space-between" mb={3}>
                                                            <Text fontSize="sm" color={textSecondary} fontWeight="600">
                                                            Coincidencia
                                                        </Text>
                                                        <Text fontSize="lg" fontWeight="800" color={platform.status === "good" ? colors.primary : colors.neutral1}>
                                                            {platform.rate}
                                                        </Text>
                                                    </HStack>
                                                    <Box position="relative" w="full">
                                                        <Progress
                                                            value={Number.parseFloat(platform.rate.replace("%", ""))}
                                                            bg={useColorModeValue("#f0f0f0", colors.secondary + "60")}
                                                            sx={{
                                                                "& > div": {
                                                                    bg: platform.status === "good" 
                                                                        ? `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` 
                                                                        : `linear-gradient(90deg, ${colors.neutral1}, ${colors.neutral2})`,
                                                                },
                                                            }}
                                                            size="lg"
                                                            borderRadius="full"
                                                            boxShadow="inset 0 2px 4px rgba(0,0,0,0.1)"
                                                        />
                                                        <Box
                                                            position="absolute"
                                                            top="50%"
                                                            left={`${Number.parseFloat(platform.rate.replace("%", ""))}%`}
                                                            transform="translate(-50%, -50%)"
                                                            w="12px"
                                                            h="12px"
                                                            borderRadius="full"
                                                            bg="white"
                                                            border="2px solid"
                                                            borderColor={platform.status === "good" ? colors.accent : colors.neutral2}
                                                            boxShadow="0 2px 8px rgba(0,0,0,0.2)"
                                                        />
                                                    </Box>
                                                </Box>

                                                <Divider borderColor={borderColor} opacity={0.6} />

                                                {/* Platform Info mejorada */}
                                                <VStack align="stretch" spacing={3} w="full">
                                                    <HStack spacing={3} p={3} borderRadius="lg" bg={colors.primary + "08"} border="1px solid" borderColor={colors.primary + "15"}>
                                                        <Box p={1} borderRadius="md" bg={colors.primary + "20"}>
                                                            <Icon as={FiMapPin} color={colors.primary} boxSize={4} />
                                                        </Box>
                                                        <VStack align="start" spacing={0} flex={1}>
                                                            <Text fontSize="xs" color={textSecondary} fontWeight="500" textTransform="uppercase" letterSpacing="0.5px">
                                                                País
                                                            </Text>
                                                            <Text fontSize="sm" color={textPrimary} fontWeight="600">
                                                                {platform.country}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                    
                                                    <HStack spacing={3} p={3} borderRadius="lg" bg={colors.accent + "08"} border="1px solid" borderColor={colors.accent + "15"}>
                                                        <Box p={1} borderRadius="md" bg={colors.accent + "20"}>
                                                            <Icon as={FiGlobe} color={colors.accent} boxSize={4} />
                                                        </Box>
                                                        <VStack align="start" spacing={0} flex={1}>
                                                            <Text fontSize="xs" color={textSecondary} fontWeight="500" textTransform="uppercase" letterSpacing="0.5px">
                                                                Idioma
                                                            </Text>
                                                            <Text fontSize="sm" color={textPrimary} fontWeight="600">
                                                                {platform.language}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>

                                                    {platform.rank && (
                                                        <HStack spacing={3} p={3} borderRadius="lg" bg={colors.neutral1 + "15"} border="1px solid" borderColor={colors.neutral1 + "25"}>
                                                            <Box p={1} borderRadius="md" bg={colors.neutral1 + "30"}>
                                                                <Icon as={FiTrendingUp} color={colors.neutral1} boxSize={4} />
                                                            </Box>
                                                            <VStack align="start" spacing={0} flex={1}>
                                                                <Text fontSize="xs" color={textSecondary} fontWeight="500" textTransform="uppercase" letterSpacing="0.5px">
                                                                    Ranking
                                                                </Text>
                                                                <Text fontSize="sm" color={textPrimary} fontWeight="600">
                                                                    #{platform.rank}
                                                                </Text>
                                                            </VStack>
                                                        </HStack>
                                                    )}
                                                    
                                                    <HStack spacing={3} p={3} borderRadius="lg" bg={colors.neutral2 + "15"} border="1px solid" borderColor={colors.neutral2 + "25"}>
                                                        <Box p={1} borderRadius="md" bg={colors.neutral2 + "30"}>
                                                            <Icon as={FiCheckCircle} color={colors.neutral2} boxSize={4} />
                                                        </Box>
                                                        <VStack align="start" spacing={0} flex={1}>
                                                            <Text fontSize="xs" color={textSecondary} fontWeight="500" textTransform="uppercase" letterSpacing="0.5px">
                                                                Coincidencias
                                                            </Text>
                                                            <Text fontSize="sm" color={textPrimary} fontWeight="600">
                                                                {platform.found} encontradas
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </VStack>

                                                {/* Action Button mejorado */}
                                                <MotionBox
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    w="full"
                                                >
                                                    <Button
                                                        as={Link}
                                                        href={platform.link}
                                                        target="_blank"
                                                        isExternal
                                                        size="md"
                                                        width="full"
                                                        h="50px"
                                                        bg={platform.status === "good" 
                                                            ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`
                                                            : `linear-gradient(135deg, ${colors.neutral1} 0%, ${colors.neutral2} 100%)`
                                                        }
                                                        color="white"
                                                        leftIcon={<ExternalLinkIcon />}
                                                        borderRadius="xl"
                                                        _hover={{
                                                            textDecoration: "none",
                                                            transform: "translateY(-2px)",
                                                            boxShadow: platform.status === "good" 
                                                                ? "0 15px 30px rgba(2, 94, 115, 0.4)"
                                                                : "0 15px 30px rgba(165, 166, 146, 0.4)",
                                                        }}
                                                        _active={{
                                                            transform: "translateY(0)",
                                                        }}
                                                        fontWeight="700"
                                                        transition="all 0.3s ease"
                                                        boxShadow={platform.status === "good" 
                                                            ? "0 8px 20px rgba(2, 94, 115, 0.3)"
                                                            : "0 8px 20px rgba(165, 166, 146, 0.3)"
                                                        }
                                                    >
                                                        Visitar Perfil
                                                    </Button>
                                                </MotionBox>
                                            </VStack>
                                        </CardBody>
                                    </MotionCard>
                                ))}
                            </SimpleGrid>
                        </MotionBox>
                    )}
                </AnimatePresence>

                {/* No Results mejorado */}
                <AnimatePresence>
                    {searched && !loading && !error && (!searchResults || searchResults.length === 0) && (
                        <MotionBox 
                            initial={{ opacity: 0, scale: 0.8, y: 50 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.8, y: -50 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card 
                                bg={glassBg} 
                                backdropFilter="blur(20px)" 
                                borderRadius="3xl" 
                                border="2px solid" 
                                borderColor={borderColor}
                                p={12}
                                textAlign="center"
                                maxW="xl"
                                mx="auto"
                                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                            >
                                <VStack spacing={6}>
                                    <Box 
                                        p={6} 
                                        borderRadius="3xl" 
                                        bg={colors.neutral1 + "15"} 
                                        border="2px solid" 
                                        borderColor={colors.neutral1 + "25"}
                                    >
                                        <Icon as={FiAlertCircle} boxSize={16} color={colors.neutral1} />
                                    </Box>
                                    <VStack spacing={3}>
                                        <Heading size="lg" color={textPrimary} fontWeight="700">
                                            Sin rastros digitales
                                        </Heading>
                                        <Text color={textSecondary} fontSize="lg" maxW="sm" lineHeight={1.6}>
                                            No se encontró presencia digital para "{formData.username}" en las plataformas analizadas
                                        </Text>
                                        <Text color={textSecondary} fontSize="sm" opacity={0.8}>
                                            Intenta con un nombre de usuario diferente o verifica la ortografía
                                        </Text>
                                    </VStack>
                                    <Button
                                        onClick={() => {
                                            setFormData({ username: "" })
                                            setSearched(false)
                                            setSearchResults(null)
                                        }}
                                        bg="transparent"
                                        color={colors.primary}
                                        border="2px solid"
                                        borderColor={colors.primary}
                                        _hover={{
                                            bg: colors.primary,
                                            color: "white",
                                            transform: "translateY(-2px)",
                                        }}
                                        borderRadius="xl"
                                        fontWeight="600"
                                        px={8}
                                        py={6}
                                        h="auto"
                                    >
                                        Realizar nueva búsqueda
                                    </Button>
                                </VStack>
                            </Card>
                        </MotionBox>
                    )}
                </AnimatePresence>
            </VStack>
        </Container>

        {/* Estilos CSS adicionales para animaciones */}
        <style jsx>{`
            @keyframes pulse {
                0%, 100% {
                    opacity: 0.4;
                    transform: translate(-50%, -50%) scale(1);
                }
                50% {
                    opacity: 0.8;
                    transform: translate(-50%, -50%) scale(1.1);
                }
            }
            
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-20px);
                }
            }
        `}</style>
    </Box>
)
}

export default UserSearchComponent