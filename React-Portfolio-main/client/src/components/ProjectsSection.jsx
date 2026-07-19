import { ArrowRight, Github, ChevronUp, Star, Code, Sparkles, Zap, Play, Eye, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import projects from "@/lib/projectsData.json";
import { cn } from "@/lib/utils";

const categoryColors = {
  React: "from-blue-500/20 to-cyan-600/20 text-blue-600 border-blue-500/30",
  Python: "from-purple-500/20 to-indigo-600/20 text-purple-600 border-purple-500/30",
  JavaScript: "from-amber-500/20 to-orange-600/20 text-amber-600 border-amber-500/30"
};

export const ProjectsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  const closeButtonRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.2, 0.1]);

  const categories = ["All", ...new Set(projects.map((project) => project.category))];
  const statuses = ["All", ...new Set(projects.map((project) => project.status))];
  const tags = ["All", ...new Set(projects.flatMap((project) => project.tags))];

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredProjects = projects.filter((project) => {
    if (activeCategory !== "All" && project.category !== activeCategory) return false;
    if (activeStatus !== "All" && project.status !== activeStatus) return false;
    if (activeTag !== "All" && !project.tags.includes(activeTag)) return false;

    if (!normalizedSearch) return true;

    const haystack = [
      project.title,
      project.description,
      project.category,
      project.status,
      project.role,
      project.timeline,
      ...project.tags
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);

  const handleFilterChange = (category) => {
    setActiveCategory(category);
    setShowAll(false);
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setShowAll(false);
  };

  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setShowAll(false);
  };

  const resetFilters = () => {
    setActiveCategory("All");
    setActiveStatus("All");
    setActiveTag("All");
    setSearchQuery("");
    setShowAll(false);
  };

  const handleVideoPlay = (project) => {
    setSelectedVideo(project);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (selectedVideo && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleCloseVideo();
      }
    };

    if (selectedVideo) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedVideo]);

  const ProjectHighlights = ({ highlights }) => (
    <ul className="space-y-1.5">
      {highlights.map((highlight, index) => (
        <li key={index} className="flex items-start gap-2 text-xs">
          <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
          <span className="text-muted-foreground/95 leading-relaxed">{highlight}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section 
      id="projects" 
      className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      ref={sectionRef}
    >
      {/* Clean Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"
          style={{ translateY: yBg, opacity: opacityBg }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-4 w-4" />
            My Projects
          </motion.div>

          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Project
            <span className="block text-primary">Portfolio</span>
          </motion.h2>

          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A collection of projects I've built to showcase my skills in full-stack development and modern web technologies.
          </motion.p>
        </motion.div>

        {/* Search + Filter Panel */}
        <motion.div
          className="space-y-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-2xl">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search projects, tech, role, or status"
                className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                aria-label="Search projects"
              />
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-4 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              Reset filters
            </button>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleFilterChange(category)}
                  aria-pressed={activeCategory === category}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition duration-200 border",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  aria-pressed={activeStatus === status}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition duration-200 border",
                    activeStatus === status
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  aria-pressed={activeTag === tag}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition duration-200 border",
                    activeTag === tag
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> project{filteredProjects.length === 1 ? "" : "s"}.
            </p>
            <p>
              {activeCategory !== "All" && `Category: ${activeCategory}`}
              {activeStatus !== "All" && ` ${activeCategory !== "All" ? "·" : ""} Status: ${activeStatus}`}
              {activeTag !== "All" && ` ${activeStatus !== "All" || activeCategory !== "All" ? "·" : ""} Tag: ${activeTag}`}
            </p>
          </div>

          {filteredProjects.length === 0 && (
            <div className="rounded-3xl border border-border bg-muted p-8 text-center text-sm text-foreground">
              <p className="font-semibold">No projects match that search yet.</p>
              <p className="text-muted-foreground mt-2">Try another keyword or clear the filters.</p>
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl border border-gray-200/50 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2.5 transition-all duration-500 h-full flex flex-col group/card">
                  
                  {/* Image/Video Section */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
                        project.status === "Live" || project.status === "Completed"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/35"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/35"
                      }`}>
                        {project.status}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm border ${categoryColors[project.category] || "bg-primary/10 text-primary border-primary/30"}`}>
                        {project.category}
                      </span>
                    </div>

                    {/* Hover Actions */}
                    <motion.div 
                      className="absolute inset-0 bg-slate-950/40 flex items-center justify-center gap-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    >
                      {/* Video Play Button */}
                      <motion.button
                        onClick={() => handleVideoPlay(project)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full backdrop-blur-md border bg-white/20 text-white border-white/40 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                        aria-label={`Play demo for ${project.title}`}
                      >
                        <Play size={20} />
                      </motion.button>
                      
                      {/* Code Button */}
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 cursor-pointer ${
                          project.githubUrl === "#" 
                            ? "bg-gray-500/50 text-gray-300 border-gray-500/30 cursor-not-allowed"
                            : "bg-white/20 text-white border-white/40 hover:bg-white/30"
                        }`}
                        onClick={(e) => project.githubUrl === "#" && e.preventDefault()}
                      >
                        <Code size={20} />
                      </motion.a>
                    </motion.div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80 mb-2">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-900/60 px-2.5 py-0.5 border border-border">
                          {project.role}
                        </span>
                        <span className="rounded-md bg-slate-100 dark:bg-slate-900/60 px-2.5 py-0.5 border border-border">
                          {project.timeline}
                        </span>
                      </div>
                      
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover/card:text-primary transition-colors duration-300">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20 shrink-0">
                            <Star size={10} className="fill-amber-500" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Key Features */}
                    <div className="mb-4 border-t border-border/40 pt-3">
                      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Highlights</h4>
                      <ProjectHighlights highlights={project.highlights} />
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2.5 py-0.5 rounded-md bg-primary/5 text-primary text-[11px] font-medium border border-primary/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Impact Section */}
                    <div className="mt-auto mb-4 border-l-2 border-primary/40 bg-primary/5 dark:bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground rounded-r-xl">
                      <span className="font-semibold text-primary block text-[10px] uppercase tracking-wider mb-0.5">Key Impact</span>
                      {project.impact}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-border/80">
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: project.demoUrl === "#" ? 1 : 1.02 }}
                        whileTap={{ scale: project.demoUrl === "#" ? 1 : 0.98 }}
                        className={cn(
                          "flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer",
                          project.demoUrl === "#"
                            ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                            : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20"
                        )}
                        aria-disabled={project.demoUrl === "#"}
                        tabIndex={project.demoUrl === "#" ? -1 : 0}
                        onClick={(e) => project.demoUrl === "#" && e.preventDefault()}
                      >
                        <Eye size={16} />
                        {project.demoUrl === "#" ? "Coming Soon" : "Live Demo"}
                      </motion.a>
                      
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: project.githubUrl === "#" ? 1 : 1.02 }}
                        whileTap={{ scale: project.githubUrl === "#" ? 1 : 0.98 }}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all duration-300 cursor-pointer",
                          project.githubUrl === "#"
                            ? "bg-muted text-muted-foreground cursor-not-allowed border-border"
                            : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/5"
                        )}
                        aria-disabled={project.githubUrl === "#"}
                        tabIndex={project.githubUrl === "#" ? -1 : 0}
                        onClick={(e) => project.githubUrl === "#" && e.preventDefault()}
                      >
                        <Github size={16} />
                        Code
                      </motion.a>
                    </div>
                  </div>

                  {/* Accent Glow Line */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${project.accentColor}`} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {filteredProjects.length > 3 && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                showAll
                  ? "bg-muted text-foreground border border-border"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {showAll ? (
                <>
                  <ChevronUp size={18} />
                  Show Less
                </>
              ) : (
                <>
                  View More Projects
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Simple CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-background border border-border rounded-2xl p-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4" />
              Get In Touch
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4">Like what you see?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities and interesting projects.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                Contact Me
                <ArrowRight size={18} />
              </motion.a>
              
              <motion.a
                href="https://github.com/Aayush-0910"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium border border-border text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Github size={18} />
                View GitHub
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleCloseVideo}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-video-title"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-background rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h3 id="project-video-title" className="text-xl font-bold text-foreground">
                    {selectedVideo.title} Demo
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedVideo.category}
                  </p>
                </div>
                <motion.button
                  ref={closeButtonRef}
                  onClick={handleCloseVideo}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                  aria-label="Close demo modal"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={selectedVideo.video}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  onEnded={handleCloseVideo}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-muted-foreground text-sm flex-1">
                    Watch the demo of {selectedVideo.title} in action
                  </p>
                  <div className="flex gap-3">
                    <motion.a
                      href={selectedVideo.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedVideo.demoUrl === "#"
                          ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                      onClick={(e) => selectedVideo.demoUrl === "#" && e.preventDefault()}
                    >
                      Visit Live Site
                    </motion.a>
                    <motion.a
                      href={selectedVideo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2 rounded-lg text-sm font-medium border transition-all duration-300 ${
                        selectedVideo.githubUrl === "#"
                          ? "bg-muted text-muted-foreground cursor-not-allowed border-border"
                          : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/5"
                      }`}
                      onClick={(e) => selectedVideo.githubUrl === "#" && e.preventDefault()}
                    >
                      View Code
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};