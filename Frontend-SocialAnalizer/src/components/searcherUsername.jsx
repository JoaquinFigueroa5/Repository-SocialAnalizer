import React, { useState } from 'react';
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
    Wrap,
    WrapItem,
    Progress
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SearchIcon,
    EmailIcon,
    CalendarIcon,
    StarIcon,
    ExternalLinkIcon
} from '@chakra-ui/icons';
import { FiMapPin, FiGithub, FiUsers, FiBookOpen, FiCheckCircle, FiAlertCircle, FiGlobe, FiTrendingUp, FiActivity } from 'react-icons/fi';
import useSocialAnalizer from '../shared/hooks/useSocialAnalizer';

// Crear componentes motion con Chakra UI
const MotionBox = motion(Box);
const MotionCard = motion(Card);

const UserSearchComponent = () => {
    const [formData, setFormData] = useState({
        username: ''
    });
    const [searchResults, setSearchResults] = useState(null);
    const [searched, setSearched] = useState(false);
    const { metadata, fetchMetadata, loading, error } = useSocialAnalizer();

    const toast = useToast();

    // Colores para modo claro/oscuro
    const bgGradient = useColorModeValue(
        'linear(to-br, blue.50, purple.50, pink.50)',
        'linear(to-br, gray.900, purple.900, blue.900)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!formData.username.trim()) {
            toast({
                title: 'Campo requerido',
                description: 'Por favor ingresa un nombre de usuario para buscar',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const dataToSend = {
                username: formData.username.trim()
            };

            const response = await fetchMetadata(dataToSend);
            console.log('Response completo:', response);
            
            // Extraer el array 'detected' de la respuesta
            const detectedPlatforms = response?.data?.detected || response?.detected || [];
            console.log('Plataformas detectadas:', detectedPlatforms);
            
            setSearchResults(detectedPlatforms);
            setSearched(true);

            if (detectedPlatforms && detectedPlatforms.length > 0 && !error) {
                toast({
                    title: 'Búsqueda completada',
                    description: `Se encontraron ${detectedPlatforms.length} plataformas para "${formData.username}"`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (err) {
            console.error('Error en la búsqueda:', err);
            setSearchResults(null);
            setSearched(true);
        }
    };

    // Función para obtener el icono de la plataforma
    const getPlatformIcon = (link) => {
        const url = link.toLowerCase();
        if (url.includes('github')) return FiGithub;
        if (url.includes('facebook')) return FiUsers;
        if (url.includes('telegram')) return FiActivity;
        if (url.includes('dailymotion')) return FiActivity;
        if (url.includes('chess')) return FiActivity;
        if (url.includes('pinterest')) return FiActivity;
        if (url.includes('reddit')) return FiActivity;
        if (url.includes('steam')) return FiActivity;
        if (url.includes('scratch')) return FiActivity;
        if (url.includes('vk')) return FiUsers;
        return FiGlobe;
    };

    // Función para obtener el color de la plataforma
    const getPlatformColor = (link) => {
        const url = link.toLowerCase();
        if (url.includes('github')) return 'gray';
        if (url.includes('facebook')) return 'blue';
        if (url.includes('telegram')) return 'cyan';
        if (url.includes('dailymotion')) return 'orange';
        if (url.includes('chess')) return 'green';
        if (url.includes('pinterest')) return 'red';
        if (url.includes('reddit')) return 'orange';
        if (url.includes('steam')) return 'purple';
        if (url.includes('scratch')) return 'yellow';
        if (url.includes('vk')) return 'blue';
        return 'gray';
    };

    // Función para extraer el nombre de la plataforma
    const getPlatformName = (link) => {
        const url = new URL(link);
        const hostname = url.hostname.replace('www.', '');
        return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
    };

    // Función para obtener estadísticas generales
    const getGeneralStats = (results) => {
        if (!results || !Array.isArray(results)) return null;

        const totalPlatforms = results.length;
        const countries = [...new Set(results.map(r => r.country).filter(Boolean))];
        const languages = [...new Set(results.map(r => r.language).filter(Boolean))];
        const averageRank = results.reduce((sum, r) => sum + (r.rank || 0), 0) / totalPlatforms;

        return {
            totalPlatforms,
            countries: countries.length,
            languages: languages.length,
            averageRank: Math.round(averageRank),
            topCountry: countries[0] || 'No especificado',
            goodStatus: results.filter(r => r.status === 'good').length
        };
    };

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24
            }
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 25
            }
        }
    };

    const generalStats = searchResults ? getGeneralStats(searchResults) : null;

    return (
        <Box minH="100vh" bgGradient={bgGradient} py={8}>
            <Container maxW="7xl">
                <VStack spacing={8}>
                    {/* Header */}
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        textAlign="center"
                    >
                        <Heading
                            size="2xl"
                            bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
                            bgClip="text"
                            mb={4}
                        >
                            Social Analyzer
                        </Heading>
                        <Text color="gray.600" fontSize="lg">
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
                        <Card bg={cardBg} shadow="xl" borderRadius="2xl">
                            <CardBody p={8}>
                                <form onSubmit={handleSearch}>
                                    <VStack spacing={4}>
                                        <InputGroup size="lg">
                                            <InputLeftElement pointerEvents="none">
                                                <SearchIcon color="gray.400" />
                                            </InputLeftElement>
                                            <Input
                                                name="username"
                                                placeholder="Escribe un nombre de usuario..."
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                borderRadius="xl"
                                                focusBorderColor="purple.400"
                                                _hover={{ borderColor: 'purple.300' }}
                                            />
                                        </InputGroup>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            width="full"
                                            bgGradient="linear(to-r, blue.400, purple.500)"
                                            color="white"
                                            _hover={{
                                                bgGradient: 'linear(to-r, blue.500, purple.600)',
                                                transform: 'translateY(-2px)',
                                            }}
                                            _active={{
                                                transform: 'translateY(0)',
                                            }}
                                            borderRadius="xl"
                                            isLoading={loading}
                                            loadingText="Analizando..."
                                            transition="all 0.2s"
                                            disabled={loading}
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
                            <MotionBox
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <VStack spacing={4}>
                                    <Spinner
                                        size="xl"
                                        color="purple.500"
                                        thickness="4px"
                                    />
                                    <Text color="gray.600">Analizando presencia digital...</Text>
                                    <Text fontSize="sm" color="gray.500">
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
                                <Alert status="error" borderRadius="xl">
                                    <AlertIcon />
                                    <Box>
                                        <AlertTitle>Error en la búsqueda</AlertTitle>
                                        <AlertDescription>
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
                            <MotionBox
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                w="full"
                            >
                                {/* Summary Card */}
                                {generalStats && (
                                    <MotionCard
                                        variants={cardVariants}
                                        bg={cardBg}
                                        shadow="xl"
                                        borderRadius="2xl"
                                        border="1px"
                                        borderColor={borderColor}
                                        mb={8}
                                    >
                                        <CardHeader>
                                            <HStack spacing={3}>
                                                <Avatar 
                                                    size="lg" 
                                                    name={formData.username}
                                                    bg="purple.500"
                                                    color="white"
                                                />
                                                <VStack align="start" spacing={1}>
                                                    <Heading size="lg">@{formData.username}</Heading>
                                                    <Text color="gray.600">
                                                        Presencia digital encontrada en {generalStats.totalPlatforms} plataformas
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </CardHeader>
                                        <CardBody pt={0}>
                                            <StatGroup>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color="gray.500">Plataformas</StatLabel>
                                                    <StatNumber fontSize="2xl" color="purple.600">
                                                        {generalStats.totalPlatforms}
                                                    </StatNumber>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color="gray.500">Países</StatLabel>
                                                    <StatNumber fontSize="2xl" color="blue.600">
                                                        {generalStats.countries}
                                                    </StatNumber>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color="gray.500">Idiomas</StatLabel>
                                                    <StatNumber fontSize="2xl" color="green.600">
                                                        {generalStats.languages}
                                                    </StatNumber>
                                                </Stat>
                                                <Stat textAlign="center">
                                                    <StatLabel fontSize="sm" color="gray.500">Status Bueno</StatLabel>
                                                    <StatNumber fontSize="2xl" color="orange.600">
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
                                            shadow="lg"
                                            borderRadius="xl"
                                            border="1px"
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
                                                h="3px"
                                                bg={platform.status === 'good' ? 'green.400' : 'orange.400'}
                                            />

                                            <CardHeader pb={2}>
                                                <HStack justify="space-between" align="start">
                                                    <HStack spacing={3}>
                                                        <Box
                                                            p={2}
                                                            borderRadius="lg"
                                                            bg={`${getPlatformColor(platform.link)}.100`}
                                                        >
                                                            <Icon 
                                                                as={getPlatformIcon(platform.link)} 
                                                                boxSize={6}
                                                                color={`${getPlatformColor(platform.link)}.600`}
                                                            />
                                                        </Box>
                                                        <VStack align="start" spacing={1}>
                                                            <Heading size="md" color="gray.800">
                                                                {platform.title || getPlatformName(platform.link)}
                                                            </Heading>
                                                            <Text color="gray.500" fontSize="sm">
                                                                {platform.type || 'Plataforma Social'}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                    <Badge
                                                        colorScheme={platform.status === 'good' ? 'green' : 'orange'}
                                                        borderRadius="full"
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
                                                            <Text fontSize="sm" color="gray.600">Coincidencia</Text>
                                                            <Text fontSize="sm" fontWeight="bold" color="purple.600">
                                                                {platform.rate}
                                                            </Text>
                                                        </HStack>
                                                        <Progress 
                                                            value={parseFloat(platform.rate.replace('%', ''))} 
                                                            colorScheme="purple" 
                                                            size="sm" 
                                                            borderRadius="full"
                                                        />
                                                    </Box>

                                                    <Divider />

                                                    {/* Platform Info */}
                                                    <VStack align="start" spacing={2} w="full">
                                                        <HStack spacing={2}>
                                                            <Icon as={FiMapPin} color="gray.400" boxSize={4} />
                                                            <Text fontSize="sm" color="gray.600">
                                                                {platform.country}
                                                            </Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiGlobe} color="gray.400" boxSize={4} />
                                                            <Text fontSize="sm" color="gray.600">
                                                                {platform.language}
                                                            </Text>
                                                        </HStack>
                                                        {platform.rank && (
                                                            <HStack spacing={2}>
                                                                <Icon as={FiTrendingUp} color="gray.400" boxSize={4} />
                                                                <Text fontSize="sm" color="gray.600">
                                                                    Rank: #{platform.rank}
                                                                </Text>
                                                            </HStack>
                                                        )}
                                                        <HStack spacing={2}>
                                                            <Icon as={FiCheckCircle} color="gray.400" boxSize={4} />
                                                            <Text fontSize="sm" color="gray.600">
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
                                                        colorScheme={getPlatformColor(platform.link)}
                                                        variant="outline"
                                                        leftIcon={<ExternalLinkIcon />}
                                                        borderRadius="lg"
                                                        _hover={{ textDecoration: 'none' }}
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
                                <MotionBox
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    textAlign="center"
                                >
                                    <Icon as={FiAlertCircle} boxSize={12} color="gray.400" mb={4} />
                                    <Heading size="md" color="gray.500" mb={2}>
                                        Sin resultados
                                    </Heading>
                                    <Text color="gray.400">
                                        No se encontró presencia digital para "{formData.username}"
                                    </Text>
                                </MotionBox>
                            </Center>
                        )}
                    </AnimatePresence>
                </VStack>
            </Container>
        </Box>
    );
};

export default UserSearchComponent;