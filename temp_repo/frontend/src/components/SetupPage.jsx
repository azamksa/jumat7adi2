import React, { useState, useEffect } from 'react';
import { 
  Container,
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import UserMenu from './UserMenu';
import UserProfileModal from './UserProfileModal';
import { PackageTracker } from '../utils/PackageTracker';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(0, 50, 98, 0.2), rgba(226, 88, 34, 0.1))',
  backdropFilter: 'blur(20px)',
  borderRadius: '25px',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 138, 76, 0.1)',
  border: '2px solid rgba(255, 138, 76, 0.2)',
  transition: 'all 0.4s ease',
  '&:hover': {
    boxShadow: '0 25px 70px rgba(226, 88, 34, 0.3), inset 0 0 25px rgba(255, 138, 76, 0.15)',
    transform: 'translateY(-5px)'
  }
}));

const CategoryButton = styled(Button)(({ selected }) => ({
  width: '220px',
  height: '280px',
  borderRadius: '20px',
  background: selected 
    ? 'linear-gradient(135deg, rgba(226, 88, 34, 0.4), rgba(255, 138, 76, 0.3))' 
    : 'linear-gradient(135deg, rgba(0, 50, 98, 0.2), rgba(31, 106, 165, 0.15))',
  border: selected ? '3px solid #FF8A4C' : '2px solid rgba(255, 138, 76, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  boxShadow: selected 
    ? '0 15px 40px rgba(226, 88, 34, 0.3)' 
    : '0 8px 20px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    background: selected 
      ? 'linear-gradient(135deg, rgba(226, 88, 34, 0.5), rgba(255, 138, 76, 0.4))' 
      : 'linear-gradient(135deg, rgba(0, 50, 98, 0.3), rgba(31, 106, 165, 0.25))',
    transform: 'scale(1.05) translateY(-8px)',
    boxShadow: selected
      ? '0 20px 50px rgba(226, 88, 34, 0.4)'
      : '0 15px 35px rgba(0, 0, 0, 0.3)'
  },
  '&:active': {
    transform: 'scale(0.98)'
  }
}));

const CategoryImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.7,
  transition: 'opacity 0.3s ease'
});

const SetupPage = ({
  teams,
  selectedCategories,
  basicCategories,
  onTeamNameChange,
  onCategorySelection,
  onStartGame,
  error,
  setShowLogin,
  user
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [userPackageLevel, setUserPackageLevel] = useState(1);

  useEffect(() => {
    if (user?.id) {
      PackageTracker.getUserPackageLevel(user.id)
        .then(level => setUserPackageLevel(level));
    }
  }, [user]);

  const handleStartGame = async () => {
    if (!currentUser) {
      alert('يجب أن تقوم بتسجيل الدخول قبل بدء اللعب!');
      setShowLogin(true);
      return;
    }

    if (!teams.team1 || !teams.team2) {
      alert('يرجى إدخال أسماء الفريقين');
      return;
    }

    if (selectedCategories.length !== 6) {
      alert('يجب اختيار 6 فئات فقط');
      return;
    }

    await PackageTracker.incrementUserPackageLevel(currentUser.id);
    onStartGame();
  };

  const handleEditProfile = () => {
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSaveProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const packageInfo = PackageTracker.getPackageInfo(userPackageLevel);

  return (
    <Container
      maxWidth="xxl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        position: 'relative'
      }}
    >
      {/* قائمة المستخدم */}
      {!currentUser ? (
        <Box sx={{ 
          position: 'fixed', 
          right: 20, 
          top: 20, 
          zIndex: 1000 
        }}>
          <Button 
            variant="outlined" 
            onClick={() => setShowLogin(true)}
            sx={{
              padding: '12px 24px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'white',
              borderColor: 'white',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              '&:hover': {
                borderColor: '#FF8A4C',
                color: '#FF8A4C',
                backgroundColor: 'rgba(255, 138, 76, 0.1)'
              }
            }}
          >
            تسجيل الدخول
          </Button>
        </Box>
      ) : (
        <UserMenu
          user={currentUser}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      )}

      {/* العنوان الرئيسي */}
      <Box textAlign="center" mb={8} pt={6}>
        <Box sx={{ 
          position: 'relative',
          mb: 6,
          animation: 'slideInDown 0.8s ease-out'
        }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2.8rem', md: '4.2rem', lg: '5rem' },
              fontWeight: 700,
              color: '#003262',
              letterSpacing: '-0.5px',
              mb: 3,
              textAlign: 'center',
              lineHeight: 1.2
            }}
          >
            تحدي الجمعة
          </Typography>
          
          <Box sx={{
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, #E25822 0%, #FF8A4C 100%)',
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </Box>

        {/* معلومات الحزمة */}
        {currentUser && (
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(0, 50, 98, 0.15), rgba(226, 88, 34, 0.1))',
            border: '2px solid rgba(255, 138, 76, 0.3)',
            borderRadius: '16px',
            padding: '32px 40px',
            margin: '50px auto',
            maxWidth: '520px',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.4s ease'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#003262',
                fontWeight: 600,
                fontSize: '0.9rem',
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                opacity: 0.7
              }}
            >
              حزمتك الحالية
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#E25822',
                fontWeight: 700,
                fontSize: '1.8rem',
                mb: 2
              }}
            >
              {packageInfo.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#D0D0D0',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              {packageInfo.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box>
                <Typography sx={{ color: '#A8A8A8', fontSize: '0.85rem', mb: 0.5 }}>
                  النقاط المتبقية
                </Typography>
                <Typography sx={{ color: '#FF8A4C', fontWeight: 700, fontSize: '1.4rem' }}>
                  {packageInfo.remainingQuestions}
                </Typography>
              </Box>
              <Box sx={{ borderLeft: '1px solid rgba(255, 138, 76, 0.3)', pl: 3 }}>
                <Typography sx={{ color: '#A8A8A8', fontSize: '0.85rem', mb: 0.5 }}>
                  الإجمالي المتاح
                </Typography>
                <Typography sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '1.4rem' }}>
                  {packageInfo.totalQuestions}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* قسم قواعد اللعبة */}
        <Box sx={{ 
          maxWidth: 1000, 
          margin: '60px auto 0', 
          padding: '0 20px',
          width: '100%'
        }}>
          <Typography 
            variant="h5" 
            sx={{
              color: '#FF8A4C',
              fontWeight: 700,
              fontSize: '1.6rem',
              mb: 5,
              textAlign: 'center'
            }}
          >
            قواعد اللعبة
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(31, 106, 165, 0.25), rgba(0, 50, 98, 0.15))',
                border: '2px solid rgba(31, 106, 165, 0.4)',
                borderRadius: '18px',
                padding: '28px 24px',
                minHeight: '200px',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 45px rgba(31, 106, 165, 0.3)',
                  border: '2px solid rgba(31, 106, 165, 0.6)',
                  background: 'linear-gradient(135deg, rgba(31, 106, 165, 0.35), rgba(0, 50, 98, 0.25))'
                }
              }}>
                <Typography variant="h6" sx={{color: '#FF8A4C', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  آلية اللعب
                </Typography>
                <Typography variant="body2" sx={{color: '#E8E8E8', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  منافسة ثقافية شيقة بين فريقين، حيث يختار كل فريق الفئات ويجيب على الأسئلة
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.25), rgba(255, 138, 76, 0.15))',
                border: '2px solid rgba(255, 138, 76, 0.4)',
                borderRadius: '18px',
                padding: '28px 24px',
                minHeight: '200px',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 45px rgba(226, 88, 34, 0.3)',
                  border: '2px solid rgba(255, 138, 76, 0.6)',
                  background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.35), rgba(255, 138, 76, 0.25))'
                }
              }}>
                <Typography variant="h6" sx={{color: '#FF8A4C', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  الوقت
                </Typography>
                <Typography variant="body2" sx={{color: '#E8E8E8', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  60 ثانية للفريق، و30 ثانية للفريق المنافس
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(31, 106, 165, 0.25), rgba(0, 50, 98, 0.15))',
                border: '2px solid rgba(31, 106, 165, 0.4)',
                borderRadius: '18px',
                padding: '28px 24px',
                minHeight: '200px',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 45px rgba(31, 106, 165, 0.3)',
                  border: '2px solid rgba(31, 106, 165, 0.6)',
                  background: 'linear-gradient(135deg, rgba(31, 106, 165, 0.35), rgba(0, 50, 98, 0.25))'
                }
              }}>
                <Typography variant="h6" sx={{color: '#FF8A4C', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  الفئات
                </Typography>
                <Typography variant="body2" sx={{color: '#E8E8E8', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  اختر 6 فئات مختلفة من الخيارات المتنوعة
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.25), rgba(255, 138, 76, 0.15))',
                border: '2px solid rgba(255, 138, 76, 0.4)',
                borderRadius: '18px',
                padding: '28px 24px',
                minHeight: '200px',
                backdropFilter: 'blur(15px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 45px rgba(226, 88, 34, 0.3)',
                  border: '2px solid rgba(255, 138, 76, 0.6)',
                  background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.35), rgba(255, 138, 76, 0.25))'
                }
              }}>
                <Typography variant="h6" sx={{color: '#FF8A4C', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  الفائز
                </Typography>
                <Typography variant="body2" sx={{color: '#E8E8E8', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  الفريق الذي يجمع أكبر عدد من النقاط يفوز
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* أسماء الفرق */}
      <StyledCard>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: '#003262',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 700,
            mb: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            opacity: 0.8
          }}
        >
          أسماء الفرق
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: '#1F6AA5', 
                  fontWeight: 700, 
                  mb: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                🔵 الفريق الأول
              </Typography>
              <TextField 
                fullWidth
                placeholder="أدخل اسم فريقك..."
                value={teams.team1}
                onChange={(e) => onTeamNameChange('team1', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#333',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    backgroundColor: '#FAFAFA',
                    '& fieldset': { 
                      borderColor: 'rgba(31, 106, 165, 0.3)',
                      borderWidth: '2px',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(31, 106, 165, 0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1F6AA5',
                      boxShadow: '0 0 20px rgba(31, 106, 165, 0.3)'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(51, 51, 51, 0.4)',
                    opacity: 1
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: '#FF8A4C', 
                  fontWeight: 700, 
                  mb: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                🟠 الفريق الثاني
              </Typography>
              <TextField
                fullWidth
                placeholder="أدخل اسم فريقك..."
                value={teams.team2}
                onChange={(e) => onTeamNameChange('team2', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#333',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    backgroundColor: '#FAFAFA',
                    '& fieldset': { 
                      borderColor: 'rgba(226, 88, 34, 0.3)',
                      borderWidth: '2px',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(226, 88, 34, 0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF8A4C',
                      boxShadow: '0 0 20px rgba(226, 88, 34, 0.3)'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(51, 51, 51, 0.4)',
                    opacity: 1
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </StyledCard>

      {/* اختيار الفئات */}
      <StyledCard>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#FF8A4C', 
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            mb: 1
          }}
        >
          🎲 اختيار الفئات
        </Typography>
        <Typography 
          variant="subtitle1" 
          gutterBottom 
          sx={{ 
            color: '#FF8A4C', 
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 700,
            mb: 4,
            background: 'linear-gradient(90deg, rgba(255, 138, 76, 0.2), rgba(31, 106, 165, 0.2))',
            padding: '15px',
            borderRadius: '15px',
            border: '2px solid rgba(255, 138, 76, 0.3)'
          }}
        >
          📊 اختر 6 فئات ({selectedCategories.length} / 6)
        </Typography>
        
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {Object.entries(basicCategories).map(([category, data]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Box sx={{
                background: `linear-gradient(135deg, ${data.color}30, ${data.color}15)`,
                borderRadius: '20px',
                padding: '25px',
                border: `2px solid ${data.color}40`,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 15px 40px ${data.color}30`,
                  border: `2px solid ${data.color}60`
                }
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: '#fff',
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  {category}
                </Typography>
                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                  {data.subcategories.map((subcat) => (
                    <Grid item xs={12} key={subcat.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CategoryButton
                        selected={selectedCategories.includes(subcat.id)}
                        onClick={() => onCategorySelection(subcat.id)}
                      >
                        <CategoryImage src={subcat.image} alt={subcat.name} />
                        <Box sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          background: selectedCategories.includes(subcat.id) 
                            ? 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.3))'
                            : 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.4))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '20px'
                        }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontSize: '1.1rem',
                              fontWeight: 800,
                              textShadow: '0 3px 8px rgba(0,0,0,0.6)',
                              textAlign: 'center',
                              padding: '0 10px'
                            }}
                          >
                            {subcat.name}
                          </Typography>
                        </Box>
                        {selectedCategories.includes(subcat.id) && (
                          <Box sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#FF8A4C',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(255, 138, 76, 0.5)'
                          }}>
                            ✓
                          </Box>
                        )}
                      </CategoryButton>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
      </StyledCard>

      {/* الفئات المختارة */}
      {selectedCategories.length > 0 && (
        <StyledCard>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: '#003262',
              fontWeight: 700,
              fontSize: '1.1rem',
              mb: 3,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: 0.8
            }}
          >
            الفئات المختارة ({selectedCategories.length}/6)
          </Typography>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={2}
            justifyContent="center"
          >
            {selectedCategories.map((id) => {
              const category = Object.values(basicCategories)
                .flatMap(cat => cat.subcategories)
                .find(sub => sub.id === id);
              return (
                <Chip
                  key={id}
                  label={category?.name}
                  onDelete={() => onCategorySelection(id)}
                  deleteIcon={<DeleteIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255, 138, 76, 0.3), rgba(226, 88, 34, 0.2))',
                    color: '#fff',
                    fontSize: '1rem',
                    padding: '8px 4px',
                    fontWeight: 600,
                    border: '2px solid rgba(255, 138, 76, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 138, 76, 0.4), rgba(226, 88, 34, 0.3))',
                      border: '2px solid rgba(255, 138, 76, 0.6)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 20px rgba(226, 88, 34, 0.3)'
                    },
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        color: '#FF8A4C'
                      }
                    }
                  }}
                />
              );
            })}
          </Box>
        </StyledCard>
      )}

      {/* زر البدء */}
      <Box 
        textAlign="center" 
        mt={8} 
        mb={4}
        sx={{
          animation: 'slideInUp 0.8s ease-out 0.2s both'
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleStartGame}
          disabled={selectedCategories.length !== 6 || !teams.team1 || !teams.team2}
          sx={{
            background: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2)
              ? '#DDD' 
              : 'linear-gradient(135deg, #E25822 0%, #FF8A4C 100%)',
            color: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2) ? '#999' : '#fff',
            fontSize: '1.1rem',
            fontWeight: 600,
            padding: '16px 48px',
            borderRadius: '8px',
            border: 'none',
            cursor: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2)
              ? '0 4px 12px rgba(0, 0, 0, 0.1)'
              : '0 8px 24px rgba(226, 88, 34, 0.25)',
            textTransform: 'none',
            letterSpacing: '0.3px',
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(226, 88, 34, 0.35)',
            },
            '&:active:not(:disabled)': {
              transform: 'translateY(0)',
            }
          }}
        >
          ابدأ اللعبة
        </Button>
        
        {(selectedCategories.length !== 6 || !teams.team1 || !teams.team2) && (
          <Typography 
            variant="body2" 
            sx={{
              color: '#E25822',
              mt: 2.5,
              fontSize: '0.95rem',
              fontWeight: 500
            }}
          >
            {!teams.team1 || !teams.team2 
              ? 'يرجى إدخال أسماء الفريقين' 
              : `اختر ${6 - selectedCategories.length} فئة أخرى`}
          </Typography>
        )}
      </Box>
          
      {error && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.08), rgba(220, 53, 69, 0.05))',
            backdropFilter: 'blur(12px)',
            color: '#C41C3B',
            padding: '14px 28px',
            borderRadius: '8px',
            border: '1px solid rgba(220, 53, 69, 0.2)',
            boxShadow: '0 8px 24px rgba(220, 53, 69, 0.15)',
            zIndex: 9999,
            animation: 'slideInDown 0.5s ease-out',
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          {error}
        </Box>
      )}

      <UserProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />

      <footer style={{
        width: '100%',
        padding: '48px 30px 32px',
        textAlign: 'center',
        background: 'linear-gradient(to top, rgba(0, 50, 98, 0.04), transparent)',
        borderTop: '1px solid rgba(0, 50, 98, 0.1)',
        backdropFilter: 'blur(8px)',
        marginTop: '80px'
      }}>
        <Typography variant="body2" sx={{color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.9rem', mb: 1, fontWeight: 500}}>
          تحدي الجمعة - اختبر معلומات الدوري السعودي
        </Typography>
        <Typography variant="caption" sx={{color: 'rgba(0, 0, 0, 0.4)', fontSize: '0.8rem', fontWeight: 400}}>
          جميع الحقوق محفوظة © 2024
        </Typography>
      </footer>
    </Container>  
  );
};

export default SetupPage;
