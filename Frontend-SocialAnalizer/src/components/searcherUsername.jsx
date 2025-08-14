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
} from "react-icons/fi"
import useSocialAnalizer from "../shared/hooks/useSocialAnalizer"

// Crear componentes motion con Chakra UI
const MotionBox = motion(Box)
const MotionCard = motion(Card)

const UserSearchComponent = () => {
    const [formData, setFormData] = useState({
        username: "",
    })
    const [searchResults, setSearchResults] = useState(null)
    const [searched, setSearched] = useState(false)
    const { metadata, fetchMetadata, loading, error } = useSocialAnalizer()
    const toast = useToast()

    const bgGradient = useColorModeValue("linear(to-br, #F2F2F2, #F2F2F2)", "linear(to-br, #010326, #0D0D0D)")
    const cardBg = useColorModeValue("#F2F2F2", "#010326")
    const borderColor = useColorModeValue("#404040", "#455927")
    const primaryColor = "#455927"
    const accentColor = "#010326"
    const textPrimary = useColorModeValue("#0D0D0D", "#F2F2F2")
    const textSecondary = useColorModeValue("#404040", "#F2F2F2")

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

            // Extraer el array 'detected' de la respuesta
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

    // Función para obtener el icono de la plataforma
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

    const getPlatformColor = (link) => {
        return "green" // Using green scheme which maps to our olive green
    }

    // Función para extraer el nombre de la plataforma
    const getPlatformName = (link) => {
        const url = new URL(link)
        const hostname = url.hostname.replace("www.", "")
        return hostname.split(".")[0].charAt(0).toUpperCase() + hostname.split(".")[0].slice(1)
    }

    // Función para obtener estadísticas generales
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

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
            },
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
            },
        },
    }

    const generalStats = searchResults ? getGeneralStats(searchResults) : null
    const errorBg = useColorModeValue("#fee", accentColor)
    const platformBg = useColorModeValue("#e8f5e8", accentColor)

    return (
        <Box minH="100vh" bg={bgGradient} py={8}>
            <Container maxW="7xl">
                <VStack spacing={8}>
                    {/* Header */}
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        textAlign="center"
                    >
                        <Heading size="2xl" color={primaryColor} mb={4} fontWeight="bold" textShadow="0 2px 4px rgba(0,0,0,0.1)">
                            Social Analyzer
                        </Heading>
                        <Text color={textSecondary} fontSize="lg" fontWeight="medium">
                            Analiza la presencia digital de usuarios en múltiples plataformas
                        </Text>
                    </MotionBox>

                    {/* Search Form */}
                    <MotionBox
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        w="full"
                        maxW="md"
                    >
                        <Card bg={cardBg} shadow="2xl" borderRadius="2xl" border="2px" borderColor={borderColor}>
                            <CardBody p={8}>
                                <form onSubmit={handleSearch}>
                                    <VStack spacing={4}>
                                        <InputGroup size="lg">
                                            <InputLeftElement pointerEvents="none">
                                                <SearchIcon color={textSecondary} />
                                            </InputLeftElement>
                                            <Input
                                                name="username"
                                                placeholder="Escribe un nombre de usuario..."
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                borderRadius="xl"
                                                borderColor={borderColor}
                                                focusBorderColor={primaryColor}
                                                _hover={{ borderColor: primaryColor }}
                                                bg={useColorModeValue("white", accentColor)}
                                                color={textPrimary}
                                                _placeholder={{ color: textSecondary }}
                                            />
                                        </InputGroup>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            width="full"
                                            bg={primaryColor}
                                            color="#F2F2F2"
                                            _hover={{
                                                bg: "#5a6b2f",
                                                transform: "translateY(-2px)",
                                                shadow: "xl",
                                            }}
                                            _active={{
                                                transform: "translateY(0)",
                                                bg: "#3d4a1f",
                                            }}
                                            borderRadius="xl"
                                            isLoading={loading}
                                            loadingText="Analizando..."
                                            transition="all 0.2s"
                                            disabled={loading}
                                            fontWeight="bold"
                                        >
                                            <SearchIcon mr={2} />
                                            Analizar Usuario
                                        </Button>
                                    </VStack>
                                </form>
                            </CardBody>
                        </Card>
                    </MotionBox>

                    {/* Loading State */}
                    <AnimatePresence>
                        {loading && (
                            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <VStack spacing={4}>
                                    <Spinner size="xl" color={primaryColor} thickness="4px" />
                                    <Text color={textPrimary} fontWeight="medium">
                                        Analizando presencia digital...
                                    </Text>
                                    <Text fontSize="sm" color={textSecondary}>
                                        Escaneando múltiples plataformas sociales
                                    </Text>
                                </VStack>
                            </MotionBox>
                        )}
                    </AnimatePresence>

                    {/* Error State */}
                    <AnimatePresence>
                        {error && searched && !loading && (
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                w="full"
                                maxW="md"
                            >
                                <Alert status="error" borderRadius="xl" bg={errorBg} borderColor="#404040" border="1px">
                                    <AlertIcon color="#e53e3e" />
                                    <Box>
                                        <AlertTitle color={textPrimary}>Error en la búsqueda</AlertTitle>
                                        <AlertDescription color={textSecondary}>
                                            {error || `No se pudo encontrar información para "${formData.username}"`}
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            </MotionBox>
                        )}
                    </AnimatePresence>

                    {/* Results */}
                    <AnimatePresence>
                        {searched && !loading && !error && searchResults && searchResults.length > 0 && (
                            <MotionBox variants={containerVariants} initial="hidden" animate="visible" w="full">
                                {/* Summary Card */}
                                {generalStats && (
                                    <MotionCard
                                        variants={cardVariants}
                                        bg={cardBg}
                                        shadow="2xl"
                                        borderRadius="2xl"
                                        border="2px"
                                        borderColor={borderColor}
                                        mb={8}
                                    >
                                        <CardHeader>
                                            <HStack spacing={3}>
                                                <Avatar size="lg" name={formData.username} bg={primaryColor} color="#F2F2F2" />
                                                <VStack align="start" spacing={1}>
                                                    <Heading size="lg" color={textPrimary}>
                                                        @{formData.username}
                                                    </Heading>
                                                    <Text color={textSecondary} fontWeight="medium">
                                                        Presencia digital encontrada en {generalStats.totalPlatforms} plataformas
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </CardHeader>
                                        <CardBody pt={0}>
                                            <StatGroup>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color={textSecondary}>
                                                        Plataformas
                                                    </StatLabel>
                                                    <StatNumber fontSize="2xl" color={primaryColor}>
                                                        {generalStats.totalPlatforms}
                                                    </StatNumber>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color={textSecondary}>
                                                        Países
                                                    </StatLabel>
                                                    <StatNumber fontSize="2xl" color={accentColor}>
                                                        {generalStats.countries}
                                                    </StatNumber>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color={textSecondary}>
                                                        Idiomas
                                                    </StatLabel>
                                                    <StatNumber fontSize="2xl" color={primaryColor}>
                                                        {generalStats.languages}
                                                    </StatNumber>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color={textSecondary}>
                                                        Status Bueno
                                                    </StatLabel>
                                                    <StatNumber fontSize="2xl" color="#404040">
                                                        {generalStats.goodStatus}
                                                    </StatNumber>
                                                </Stat>
                                            </StatGroup>
                                        </CardBody>
                                    </MotionCard>
                                )}

                                {/* Platform Cards */}
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {searchResults.map((platform, index) => (
                                        <MotionCard
                                            key={index}
                                            variants={cardVariants}
                                            whileHover="hover"
                                            bg={cardBg}
                                            shadow="xl"
                                            borderRadius="xl"
                                            border="2px"
                                            borderColor={borderColor}
                                            overflow="hidden"
                                            position="relative"
                                        >
                                            {/* Status indicator */}
                                            <Box
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                h="4px"
                                                bg={platform.status === "good" ? primaryColor : "#404040"}
                                            />

                                            <CardHeader pb={2}>
                                                <HStack justify="space-between" align="start">
                                                    <HStack spacing={3}>
                                                        <Box p={3} borderRadius="lg" bg={platformBg} border="1px" borderColor={borderColor}>
                                                            <Icon as={getPlatformIcon(platform.link)} boxSize={6} color={primaryColor} />
                                                        </Box>
                                                        <VStack align="start" spacing={1}>
                                                            <Heading size="md" color={textPrimary}>
                                                                {platform.title || getPlatformName(platform.link)}
                                                            </Heading>
                                                            <Text color={textSecondary} fontSize="sm" fontWeight="medium">
                                                                {platform.type || "Plataforma Social"}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                    <Badge
                                                        bg={platform.status === "good" ? primaryColor : "#404040"}
                                                        color="#F2F2F2"
                                                        borderRadius="full"
                                                        px={3}
                                                        py={1}
                                                        fontWeight="bold"
                                                    >
                                                        {platform.status}
                                                    </Badge>
                                                </HStack>
                                            </CardHeader>

                                            <CardBody pt={0}>
                                                <VStack align="start" spacing={4}>
                                                    {/* Match Rate Progress */}
                                                    <Box w="full">
                                                        <HStack justify="space-between" mb={2}>
                                                            <Text fontSize="sm" color={textSecondary} fontWeight="medium">
                                                                Coincidencia
                                                            </Text>
                                                            <Text fontSize="sm" fontWeight="bold" color={primaryColor}>
                                                                {platform.rate}
                                                            </Text>
                                                        </HStack>
                                                        <Progress
                                                            value={Number.parseFloat(platform.rate.replace("%", ""))}
                                                            bg={useColorModeValue("#e0e0e0", "#0D0D0D")}
                                                            sx={{
                                                                "& > div": {
                                                                    bg: primaryColor,
                                                                },
                                                            }}
                                                            size="sm"
                                                            borderRadius="full"
                                                        />
                                                    </Box>

                                                    <Divider borderColor={borderColor} />

                                                    {/* Platform Info */}
                                                    <VStack align="start" spacing={2} w="full">
                                                        <HStack spacing={2}>
                                                            <Icon as={FiMapPin} color={textSecondary} boxSize={4} />
                                                            <Text fontSize="sm" color={textPrimary} fontWeight="medium">
                                                                {platform.country}
                                                            </Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiGlobe} color={textSecondary} boxSize={4} />
                                                            <Text fontSize="sm" color={textPrimary} fontWeight="medium">
                                                                {platform.language}
                                                            </Text>
                                                        </HStack>
                                                        {platform.rank && (
                                                            <HStack spacing={2}>
                                                                <Icon as={FiTrendingUp} color={textSecondary} boxSize={4} />
                                                                <Text fontSize="sm" color={textPrimary} fontWeight="medium">
                                                                    Rank: #{platform.rank}
                                                                </Text>
                                                            </HStack>
                                                        )}
                                                        <HStack spacing={2}>
                                                            <Icon as={FiCheckCircle} color={textSecondary} boxSize={4} />
                                                            <Text fontSize="sm" color={textPrimary} fontWeight="medium">
                                                                {platform.found} coincidencias
                                                            </Text>
                                                        </HStack>
                                                    </VStack>

                                                    {/* Action Button */}
                                                    <Button
                                                        as={Link}
                                                        href={platform.link}
                                                        target="_blank"
                                                        isExternal
                                                        size="sm"
                                                        width="full"
                                                        bg="transparent"
                                                        color={primaryColor}
                                                        border="2px"
                                                        borderColor={primaryColor}
                                                        leftIcon={<ExternalLinkIcon />}
                                                        borderRadius="lg"
                                                        _hover={{
                                                            textDecoration: "none",
                                                            bg: primaryColor,
                                                            color: "#F2F2F2",
                                                            transform: "translateY(-1px)",
                                                        }}
                                                        _active={{
                                                            transform: "translateY(0)",
                                                        }}
                                                        fontWeight="bold"
                                                        transition="all 0.2s"
                                                    >
                                                        Ver Perfil
                                                    </Button>
                                                </VStack>
                                            </CardBody>
                                        </MotionCard>
                                    ))}
                                </SimpleGrid>
                            </MotionBox>
                        )}
                    </AnimatePresence>

                    {/* No Results */}
                    <AnimatePresence>
                        {searched && !loading && !error && (!searchResults || searchResults.length === 0) && (
                            <Center>
                                <MotionBox initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} textAlign="center">
                                    <Icon as={FiAlertCircle} boxSize={12} color={textSecondary} mb={4} />
                                    <Heading size="md" color={textPrimary} mb={2}>
                                        Sin resultados
                                    </Heading>
                                    <Text color={textSecondary}>No se encontró presencia digital para "{formData.username}"</Text>
                                </MotionBox>
                            </Center>
                        )}
                    </AnimatePresence>
                </VStack>
            </Container>
        </Box>
    )
}

export default UserSearchComponent
