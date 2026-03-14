import { Facebook, Instagram, MapPin, Pin, Phone, Mail, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GoogleLogin from '../components/GoogleLogin';
import RegisterForm from '../components/enrollment/RegisterForm';
import { Modal, Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const ITLaunchpad: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [showFullAbout, setShowFullAbout] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); 
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formStep, setFormStep] = useState<"upload" | "manual" | "review">("upload");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface Course {
    _id: string;
    name: string;
    description?: string;
    managerName?: string;
    image?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    capacity?: number;
    enrolledCount?: number;
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses/available");
        const data = await res.json();
        if (data?.data) setCourses(data.data);
      } catch (err: unknown) {
        console.error("Lỗi tải danh sách khóa học:", err instanceof Error ? err.message : "Unknown error");
      }
    };
    fetchCourses();
  }, []);

  const handleOpenForm = (course: Course | null) => {
    setSelectedCourse(course);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCourse(null);
  };

  const nextCourses = () => {
    if (courses.length <= (isMobile ? 1 : isTablet ? 2 : 4)) return;
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  const prevCourses = () => {
    if (courses.length <= (isMobile ? 1 : isTablet ? 2 : 4)) return;
    setCurrentIndex(
      (prev) => (prev - 1 + courses.length) % courses.length
    );
  };

  const coursesPerView = isMobile ? 1 : isTablet ? 2 : 4;
  const displayedCourses =
    courses.length <= coursesPerView
      ? courses
      : Array.from({ length: coursesPerView }, (_, i) => {
        return courses[(currentIndex + i) % courses.length];
      });

  const galleryImages = [
    '/img/image2.jpg',
    '/img/image1.png',
    '/img/image3.jpeg',
    '/img/image4.jpg',
    '/img/image5.webp'
  ];

  return (
    <div style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: isMobile ? '100%' : isTablet ? '300px' : '520px',
          padding: isMobile ? '15px 20px' : '30px 50px',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: isMobile ? '14px' : '20px',
            letterSpacing: isMobile ? '1px' : '2px',
            fontWeight: 'normal',
            color: 'orange'
          }}>
            <span style={{ color: '#4B8310', fontWeight: 'bold' }}>IT LAUNCHPAD</span> LMS
          </h1>
          {isMobile && (
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </IconButton>
          )}
        </div>

        <div style={{
          flex: 1,
          width: isMobile ? '100%' : 'auto',
          backgroundColor: '#EC7510',
          padding: isMobile ? '15px 20px' : '30px 50px',
          display: isMobile && !mobileMenuOpen ? 'none' : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'flex-end',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '15px' : '40px'
        }}>
          <a href="#home" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', letterSpacing: '1px' }}>Home</a>
          <a href="#courses" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', letterSpacing: '1px' }}>Courses</a>
          <a href="#about" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', letterSpacing: '1px' }}>About</a>
          <a href="#gallery" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', letterSpacing: '1px' }}>Gallery</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', letterSpacing: '1px' }}>Contact</a>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: isMobile ? 'auto' : 'auto'
          }}>
            <GoogleLogin />
          </div>
        </div>
      </nav>

      {/* Social Media Bar - Hidden on Mobile */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'white',
          padding: '20px 10px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        }}>
          <a href="#" style={{ color: '#d35400', textDecoration: 'none' }}>
            <Pin size={20} />
          </a>
          <a href="https://www.facebook.com/fsoftacademy.dn" style={{ color: '#d35400', textDecoration: 'none' }}>
            <Facebook size={20} />
          </a>
          <a href="https://www.instagram.com/fptsoftwareacademy?igsh=MXIzOTdycmxraTJodw==" style={{ color: '#d35400', textDecoration: 'none' }}>
            <Instagram size={20} />
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" style={{
        marginTop: isMobile ? '120px' : '90px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : '600px',
        background: 'radial-gradient(circle at 30% 50%, #EC7510 0%, #DC9B6F 35%, #2d7a52 70%, #1a5f3f 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          flex: isMobile ? '1' : '0 0 55%',
          padding: isMobile ? '40px 20px' : isTablet ? '60px 40px' : '100px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: isMobile ? '32px' : isTablet ? '48px' : '70px',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '30px',
            letterSpacing: isMobile ? '1px' : '2px'
          }}>
            YOUR SOFTWARE CAREER STARTS HERE
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '18px',
            marginBottom: '40px',
            lineHeight: '1.6',
            opacity: 0.95
          }}>
            Join IT Launchpad's comprehensive training program and become a professional software developer
          </p>
          <button
            onClick={() => handleOpenForm(null)}
            style={{
              backgroundColor: '#EC7510',
              color: 'white',
              border: '2px solid white',
              padding: isMobile ? '12px 30px' : '15px 40px',
              fontSize: isMobile ? '14px' : '16px',
              cursor: 'pointer',
              width: 'fit-content',
              letterSpacing: '2px',
              fontWeight: 'bold'
            }}
          >
            Enroll Now
          </button>
        </div>
        <div style={{
          flex: isMobile ? '1' : '0 0 45%',
          minHeight: isMobile ? '300px' : 'auto',
          backgroundImage: 'url("/img/b1.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: isMobile ? '60px 20px' : isTablet ? '80px 40px' : '120px 80px',
        backgroundColor: '#F5F3EE'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '40px' : '80px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ flex: isMobile ? '1' : '0 0 45%', width: isMobile ? '100%' : 'auto' }}>
            <img
              src="./img/banner1.png"
              alt="About"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: isMobile ? '32px' : isTablet ? '38px' : '48px',
              color: '#023665',
              marginBottom: '30px',
              fontWeight: 'bold',
              lineHeight: '1.2'
            }}>
              About IT Launchpad LMS
            </h2>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              lineHeight: '1.8',
              color: '#666',
              marginBottom: '40px'
            }}>
              IT Launchpad is a modern learning management platform designed to support IT training centers in delivering high-quality education and efficiently managing their academic operations. The system provides a centralized environment where administrators, instructors, and students can interact seamlessly throughout the learning process. From course management and student enrollment to progress tracking and performance evaluation, IT Launchpad simplifies complex administrative tasks while enhancing the overall learning experience.
              {showFullAbout && (
                <span> The platform also focuses on efficiency and scalability. As training centers grow and introduce new courses or programs, IT Launchpad provides the flexibility to manage multiple classes, instructors, and learners within a single integrated system. By combining powerful management tools with an intuitive user interface, IT Launchpad helps institutions focus on what matters most: developing the next generation of skilled IT professionals.</span>
              )}
            </p>
            <button
              onClick={() => setShowFullAbout(!showFullAbout)}
              style={{
                backgroundColor: '#EC7510',
                color: 'white',
                border: 'none',
                padding: isMobile ? '12px 30px' : '15px 40px',
                fontSize: isMobile ? '12px' : '14px',
                cursor: 'pointer',
                letterSpacing: '2px',
                transition: 'all 0.3s ease'
              }}>
              {showFullAbout ? 'Show Less' : 'Read More'}
            </button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section
        id="courses"
        style={{
          position: "relative",
          background: "radial-gradient(ellipse at 70% 30%, #ffa726 0%, #EC7510 30%, #DC9B6F 60%, #ff9800 100%)",
          paddingBottom: isMobile ? "30px" : "50px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#ECECEC",
            textAlign: "center",
            padding: isMobile ? "30px 20px" : "40px 20px 40px",
            color: "#023665",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            marginBottom: isMobile ? "30px" : "50px",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "38px" : "48px",
              marginBottom: "12px",
              fontWeight: "bold",
              color: "#023665",
            }}
          >
            Our Courses
          </h2>
          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color: "#023665",
              letterSpacing: "1px",
              fontWeight: "500",
            }}
          >
            Learn How to Be a Software Professional Today
          </p>
        </div>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={isMobile ? 1 : 2}
          mb={1.5}
          px={isMobile ? 1 : 0}
        >
          {!isMobile && (
            <IconButton
              onClick={prevCourses}
              sx={{
                color: "white",
                transform: isTablet ? "translateX(20px)" : "translateX(50px)",
              }}
            >
              <ArrowBackIos />
            </IconButton>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: isMobile ? "20px" : "30px",
              maxWidth: "1400px",
              margin: "0 auto",
              flex: "1",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {displayedCourses.map((course, index) => {
              const imageSrc = `/img/course${(index % 5) + 1}.jpg`;

              return (
                <Box
                  key={course._id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                    },
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={course.name}
                    style={{
                      width: "100%",
                      height: isMobile ? "200px" : "250px",
                      objectFit: "cover",
                    }}
                  />

                  <Box
                    sx={{
                      padding: isMobile ? "20px" : "25px",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "left",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: isMobile ? "18px" : "20px",
                        marginBottom: "10px",
                        fontWeight: "bold",
                        color: "#023665",
                        minHeight: isMobile ? "auto" : "48px",
                      }}
                    >
                      {course.name}
                    </h3>
                    <p
                      style={{
                        fontSize: isMobile ? "13px" : "14px",
                        color: "#444",
                        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                        marginBottom: "0px",
                        lineHeight: "1.65",
                        flexGrow: 1,
                      }}
                    >
                      {course.description ? course.description : "No description available."}
                    </p>
                  </Box>

                  <Box sx={{ padding: isMobile ? "0px 20px 20px" : "0px 25px 25px" }}>
                    <button
                      style={{
                        backgroundColor: "#EC7510",
                        color: "white",
                        border: "none",
                        padding: isMobile ? "10px 25px" : "12px 30px",
                        fontSize: isMobile ? "12px" : "13px",
                        cursor: "pointer",
                        letterSpacing: "1px",
                        borderRadius: "6px",
                        transition: "background-color 0.3s ease",
                        width: "100%",
                      }}
                      onClick={() => handleOpenForm(course)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#d66a0d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#EC7510";
                      }}
                    >
                      Book Now
                    </button>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {!isMobile && (
            <IconButton
              onClick={nextCourses}
              sx={{
                color: "white",
                transform: isTablet ? "translateX(-20px)" : "translateX(-50px)",
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          )}
        </Box>

        {/* Mobile Navigation Dots */}
        {isMobile && courses.length > 1 && (
          <Box display="flex" justifyContent="center" gap={1} mt={3}>
            {Array.from({ length: courses.length }).map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        )}
      </section>

      {/* Students Work Gallery */}
      <section id="gallery" style={{
        padding: isMobile ? '60px 20px' : isTablet ? '80px 40px' : '120px 80px',
        backgroundColor: '#F5F3EE'
      }}>
        <h2 style={{
          fontSize: isMobile ? '32px' : isTablet ? '38px' : '48px',
          textAlign: 'center',
          marginBottom: isMobile ? '40px' : '80px',
          fontWeight: 'bold',
          color: '#023665'
        }}>Students Work</h2>
        <div style={{
          maxWidth: isMobile ? '100%' : '1100px',
          margin: '0 auto',
          border: isMobile ? '10px solid #EC7510' : '15px solid #EC7510',
          padding: '0'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gridTemplateRows: isMobile ? 'repeat(5, 200px)' : 'repeat(2, 250px)',
            gap: '0'
          }}>
            <div style={{
              gridColumn: isMobile ? '1' : '1',
              gridRow: isMobile ? '1' : '1',
              background: `#2d7a52 url(${galleryImages[0]}) center/cover no-repeat`,
            }}></div>

            <div style={{
              gridColumn: isMobile ? '1' : '2 / 4',
              gridRow: isMobile ? '2' : '1',
              background: `#2d7a52 url(${galleryImages[1]}) center/cover no-repeat`,
            }}></div>

            <div style={{
              gridColumn: isMobile ? '1' : '1',
              gridRow: isMobile ? '3' : '2',
              background: `#2d7a52 url(${galleryImages[2]}) center/cover no-repeat`,
            }}></div>

            <div style={{
              gridColumn: isMobile ? '1' : '2',
              gridRow: isMobile ? '4' : '2',
              background: `linear-gradient(rgba(26,95,63,0.2), rgba(26,95,63,0.2)), url(${galleryImages[3]}) center/cover no-repeat`,
            }}></div>

            <div style={{
              gridColumn: isMobile ? '1' : '3',
              gridRow: isMobile ? '5' : '2',
              background: `linear-gradient(rgba(26,95,63,0.3), rgba(26,95,63,0.3)), url(${galleryImages[4]}) center/cover no-repeat`,
            }}></div>
          </div>
          <div style={{
            backgroundColor: '#EC7510',
            color: 'white',
            textAlign: 'center',
            padding: isMobile ? '15px' : '20px',
            fontSize: isMobile ? '14px' : '16px',
            letterSpacing: isMobile ? '1px' : '2px',
            cursor: 'pointer'
          }}>
            Learning for a better future
          </div>
        </div>
      </section>

      <section id="contact" style={{
        padding: isMobile ? '60px 20px' : isTablet ? '80px 40px' : '100px 80px',
        background: 'radial-gradient(ellipse at 30% 50%, #ffa726 0%, #EC7510 40%, #DC9B6F 70%, #c87010 100%)',
        color: 'white'
      }}>
        {/* Contact Info */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : isTablet ? 'row' : 'row', // Sửa 'wrap' thành 'row'
          flexWrap: isTablet ? 'wrap' : 'nowrap', // Thêm flexWrap riêng
          justifyContent: 'center',
          gap: isMobile ? '30px' : isTablet ? '40px' : '100px',
          marginBottom: isMobile ? '40px' : '60px',
          fontSize: isMobile ? '13px' : '14px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} />
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Campus Address</div>
              <div>Hoà Hải, Ngũ Hành Sơn, Đà Nẵng</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={18} />
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Telephone:</div>
              <div>+84 236 730 9933</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={18} />
            <div>
              <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Email:</div>
              <div>itlaunchpad@gmail.com</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <a href="https://www.facebook.com/fsoftacademy.dn/" style={{ color: 'white', textDecoration: 'none' }}>
              <Facebook size={20} />
            </a>
            <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
              <Pin size={20} />
            </a>
            <a href="https://www.instagram.com/fptsoftwareacademy?igsh=MXIzOTdycmxraTJodw==" style={{ color: 'white', textDecoration: 'none' }}>
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Google Map */}
        <div style={{
          height: isMobile ? '300px' : '400px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <iframe
            src="https://www.google.com/maps?q=Trường+Đại+học+FPT+Đà+Nẵng&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Modal */}
      <Modal
        open={openForm}
        onClose={handleCloseForm}
        disableScrollLock
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "90%",
            maxWidth: formStep === "review"
              ? (isMobile ? "95%" : 1400)
              : (isMobile ? "95%" : 500),
            maxHeight: "100vh",
            bgcolor: "background.paper",
            borderRadius: "16px",
            boxShadow: 24,
            overflow: { xs: "auto", md: "hidden" }
          }}
        >
          <RegisterForm
            selectedCourse={selectedCourse}
            courses={courses}
            onClose={handleCloseForm}
            onStepChange={setFormStep}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ITLaunchpad;