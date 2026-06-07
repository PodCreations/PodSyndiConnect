import { GuestProfile, HostProfile, MatchWeights, ScoreTrace } from './types';

/**
 * Calculates compatibility between a podcast Guest and a podcast Host.
 */
export function calculateMatchScore(
  guest: GuestProfile,
  host: HostProfile,
  weights: MatchWeights
): ScoreTrace {
  const sumWeights =
    (weights.reviews || 0) +
    weights.topics +
    weights.industry +
    weights.experience +
    weights.format +
    weights.audience +
    weights.location +
    weights.language;

  // Accept small floating point rounding, e.g. 0.999 to 1.001
  const isValid = Math.abs(sumWeights - 1.0) < 0.005;

  if (!isValid) {
    return {
      reviews: { score: 0, maxWeight: weights.reviews || 0, weighted: 0, detail: 'Weights do not sum to 1.00' },
      topics: { score: 0, maxWeight: weights.topics, weighted: 0, detail: 'Weights do not sum to 1.00' },
      industry: { score: 0, maxWeight: weights.industry, weighted: 0, detail: 'Weights do not sum to 1.00' },
      experience: { score: 0, maxWeight: weights.experience, weighted: 0, detail: 'Weights do not sum to 1.00' },
      format: { score: 0, maxWeight: weights.format, weighted: 0, detail: 'Weights do not sum to 1.00' },
      audience: { score: 0, maxWeight: weights.audience, weighted: 0, detail: 'Weights do not sum to 1.00' },
      location: { score: 0, maxWeight: weights.location, weighted: 0, detail: 'Weights do not sum to 1.00' },
      language: { score: 0, maxWeight: weights.language, weighted: 0, detail: 'Weights do not sum to 1.00' },
      compositeScore: 0,
      isValid: false,
    };
  }

  // 1. Topics Match
  const commonTopics = guest.topics.filter((t) => host.showTopics.includes(t));
  const topicsRatio = host.showTopics.length > 0 ? commonTopics.length / host.showTopics.length : 1.0;
  const topicsScore = Math.min(1.0, topicsRatio);
  const topicsDetail = commonTopics.length > 0 
    ? `Overlap: [${commonTopics.join(', ')}] (${commonTopics.length}/${host.showTopics.length} of Host's topics)`
    : `No overlap. Host topics: [${host.showTopics.join(', ')}], Guest topics: [${guest.topics.join(', ')}]`;

  // 2. Industry Alignment
  let industryScore = 0.0;
  let industryDetail = '';
  if (guest.industry.toLowerCase() === host.industry.toLowerCase()) {
    industryScore = 1.0;
    industryDetail = `Exact industry match: "${guest.industry}"`;
  } else {
    // Check if there are overlapping tags
    const commonTags = guest.tags.filter((t) => host.tags.includes(t));
    if (commonTags.length > 0) {
      industryScore = 0.5;
      industryDetail = `Industry mismatch ("${guest.industry}" vs "${host.industry}"), but active tags overlap: [${commonTags.join(', ')}]`;
    } else {
      industryScore = 0.1;
      industryDetail = `Industry mismatch ("${guest.industry}" vs "${host.industry}") and no shared tags`;
    }
  }

  // 3. Experience Alignment
  const levelValues = { Beginner: 1, Intermediate: 2, Expert: 3 };
  const guestVal = levelValues[guest.experienceLevel] || 1;
  const hostVal = levelValues[host.requiredExperienceLevel] || 1;
  let experienceScore = 0.0;
  let experienceDetail = '';

  if (guestVal >= hostVal) {
    experienceScore = 1.0;
    experienceDetail = `Guest is qualified! Guest level is ${guest.experienceLevel}, Host requires ${host.requiredExperienceLevel}`;
  } else if (hostVal - guestVal === 1) {
    experienceScore = 0.5;
    experienceDetail = `Guest is slightly underqualified. Guest is ${guest.experienceLevel}, Host requires ${host.requiredExperienceLevel}`;
  } else {
    experienceScore = 0.1;
    experienceDetail = `Guest level mismatch. Guest is ${guest.experienceLevel}, Host requires Expert level`;
  }

  // 4. Format Compatibility
  let formatScore = 0.0;
  let formatDetail = '';
  const guestFormats = guest.preferredFormats || [];
  if (guestFormats.includes(host.format)) {
    formatScore = 1.0;
    formatDetail = `Direct format match! Guest enjoys doing: [${guestFormats.join(', ')}], Host format is: "${host.format}"`;
  } else if (guestFormats.length === 0) {
    formatScore = 0.9;
    formatDetail = `Guest lists no format preference (presumed open). Host format is: "${host.format}"`;
  } else {
    formatScore = 0.3;
    formatDetail = `Format mismatch! Guest prefers [${guestFormats.join(', ')}], Host format is: "${host.format}"`;
  }

  // 5. Audience Fit
  const guestAudValue = levelValues[guest.audiencePreference.split('/')[1] === 'Mid' ? 'Intermediate' : guest.audiencePreference.split('/')[1] === 'Large' ? 'Expert' : 'Beginner'];
  const hostAudValue = levelValues[host.audienceSize.split('/')[1] === 'Mid' ? 'Intermediate' : host.audienceSize.split('/')[1] === 'Large' ? 'Expert' : 'Beginner'];
  let audienceScore = 0.0;
  let audienceDetail = '';

  if (guest.audiencePreference === host.audienceSize) {
    audienceScore = 1.0;
    audienceDetail = `Exact target audience alignment: "${guest.audiencePreference}"`;
  } else {
    const diff = Math.abs(guestAudValue - hostAudValue);
    if (diff === 1) {
      audienceScore = 0.6;
      audienceDetail = `Adjacent audience sizes ("${guest.audiencePreference}" vs "${host.audienceSize}")`;
    } else {
      audienceScore = 0.2;
      audienceDetail = `Significant audience size gap ("${guest.audiencePreference}" vs "${host.audienceSize}")`;
    }
  }

  // 6. Location/Remote Compatibility
  let locationScore = 0.0;
  let locationDetail = '';
  
  const isHostRemote = host.remoteOptions === 'Remote Only';
  const isGuestRemote = guest.remotePreference === 'Remote Only';
  const isHostInPerson = host.remoteOptions === 'In-Person Only';
  const isGuestInPerson = guest.remotePreference === 'In-Person Only';

  const guestLocClean = guest.location.toLowerCase();
  const hostLocClean = host.location.toLowerCase();
  const sameLocation = guestLocClean === hostLocClean || 
                       guestLocClean.includes(hostLocClean.split(',')[0]) || 
                       hostLocClean.includes(guestLocClean.split(',')[0]);

  if (isHostRemote && isGuestRemote) {
    locationScore = 1.0;
    locationDetail = 'Perfect remote agreement! Both show and guest are 100% remote.';
  } else if (isHostRemote || isGuestRemote) {
    if (isHostRemote && !isGuestInPerson) {
      locationScore = 1.0;
      locationDetail = `Show is fully remote, Guest prefers ${guest.remotePreference}. Compatible.`;
    } else if (isGuestRemote && !isHostInPerson) {
      locationScore = 1.0;
      locationDetail = `Guest is fully remote, Show allows ${host.remoteOptions}. Compatible.`;
    } else {
      locationScore = 0.2;
      locationDetail = `Incompatible formats: Host is ${host.remoteOptions} and Guest is ${guest.remotePreference}.`;
    }
  } else {
    // Both or at least one is In-Person/Hybrid
    if (sameLocation) {
      locationScore = 1.0;
      locationDetail = `Geography matches! Location: "${guest.location}" vs "${host.location}". Both offer In-Person or Hybrid.`;
    } else if (guest.remotePreference === 'Hybrid' && host.remoteOptions === 'Hybrid') {
      locationScore = 0.7;
      locationDetail = `Locations differ ("${guest.location}" vs "${host.location}"), but both can support hybrid/remote structures.`;
    } else {
      locationScore = 0.3;
      locationDetail = `Location barrier: Host is in "${host.location}" (${host.remoteOptions}) and Guest is in "${guest.location}" (${guest.remotePreference})`;
    }
  }

  // 7. Language Compatibility
  const commonLanguages = guest.languages.filter((l) => host.languages.includes(l));
  let languageScore = 0.0;
  let languageDetail = '';

  if (host.languages.every((l) => guest.languages.includes(l))) {
    languageScore = 1.0;
    languageDetail = `Perfect cover! Guest speaks all requested show languages: [${host.languages.join(', ')}]`;
  } else if (commonLanguages.length > 0) {
    languageScore = 0.55;
    languageDetail = `Partial language match! Common: [${commonLanguages.join(', ')}]. Host asks for [${host.languages.join(', ')}]`;
  } else {
    languageScore = 0.0;
    languageDetail = `Language barrier. Guest speaks [${guest.languages.join(', ')}], Host requires [${host.languages.join(', ')}]`;
  }

  // 8. Reviews / Past Performance
  let reviewsScore = 0.5; // neutral base
  let reviewsDetail = 'No previous reviews. Neutral baseline applied.';
  const guestRating = guest.reviewRating;
  const hostRating = host.reviewRating;
  
  if (guestRating !== undefined && hostRating !== undefined) {
    const avgRating = (guestRating + hostRating) / 2;
    reviewsScore = Math.max(0, avgRating / 5.0);
    reviewsDetail = `Mutual past reviews combined: ${avgRating.toFixed(2)} / 5.0`;
  } else if (guestRating !== undefined) {
    reviewsScore = Math.max(0, guestRating / 5.0);
    reviewsDetail = `Evaluating Guest past review score: ${guestRating.toFixed(2)} / 5.0`;
  } else if (hostRating !== undefined) {
    reviewsScore = Math.max(0, hostRating / 5.0);
    reviewsDetail = `Evaluating Host past review score: ${hostRating.toFixed(2)} / 5.0`;
  }

  // Compute composite score S = sum(w * T)
  const weightedReviews = reviewsScore * (weights.reviews || 0);
  const weightedTopics = topicsScore * weights.topics;
  const weightedIndustry = industryScore * weights.industry;
  const weightedExperience = experienceScore * weights.experience;
  const weightedFormat = formatScore * weights.format;
  const weightedAudience = audienceScore * weights.audience;
  const weightedLocation = locationScore * weights.location;
  const weightedLanguage = languageScore * weights.language;

  const rawComposite =
    weightedReviews +
    weightedTopics +
    weightedIndustry +
    weightedExperience +
    weightedFormat +
    weightedAudience +
    weightedLocation +
    weightedLanguage;

  const compositeScore = Math.round(rawComposite * 100);

  return {
    reviews: { score: reviewsScore, maxWeight: weights.reviews || 0, weighted: weightedReviews, detail: reviewsDetail },
    topics: { score: topicsScore, maxWeight: weights.topics, weighted: weightedTopics, detail: topicsDetail },
    industry: { score: industryScore, maxWeight: weights.industry, weighted: weightedIndustry, detail: industryDetail },
    experience: { score: experienceScore, maxWeight: weights.experience, weighted: weightedExperience, detail: experienceDetail },
    format: { score: formatScore, maxWeight: weights.format, weighted: weightedFormat, detail: formatDetail },
    audience: { score: audienceScore, maxWeight: weights.audience, weighted: weightedAudience, detail: audienceDetail },
    location: { score: locationScore, maxWeight: weights.location, weighted: weightedLocation, detail: locationDetail },
    language: { score: languageScore, maxWeight: weights.language, weighted: weightedLanguage, detail: languageDetail },
    compositeScore: Math.min(100, Math.max(0, compositeScore)),
    isValid: true,
  };
}

/**
 * Generates the clean WordPress PHP Plugin Code.
 */
export function generateWordPressPluginPHP(weights: MatchWeights): string {
  return `<?php
/**
 * Plugin Name: PodSyndiConnect Core
 * Plugin URI: https://github.com/deadamericapodcast/podsyndiconnect
 * Description: Connects Podcast Hosts (psc_host) and Guests (psc_guest) via Custom Post Types, ACF matching, and an Elementor Gold Shield Match Badge.
 * Version: 1.0.0
 * Author: PodSyndiConnect Team
 * Text Domain: podsyndiconnect
 * License: GPL2
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * PodSyndiConnect Main Service Container Container
 */
class PodSyndiConnect_Plugin {
    
    private static $instance = null;
    
    public static function get_instance() {
        if ( self::$instance === null ) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Init hooks
        add_action( 'init', array( $this, 'register_custom_post_types' ) );
        add_action( 'acf/init', array( $this, 'register_acf_field_groups' ) );
        add_shortcode( 'psc_match_score_badge_dynamic', array( $this, 'render_badge_shortcode' ) );
        add_shortcode( 'psc_interactive_simulator', array( $this, 'render_interactive_simulator_shortcode' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
    }

    /**
     * Register Custom Post Types for podcast hosts and podcast guests
     */
    public function register_custom_post_types() {
        // Register Guest Profile (psc_guest)
        register_post_type( 'psc_guest', array(
            'labels' => array(
                'name' => __( 'PSC Guests', 'podsyndiconnect' ),
                'singular_name' => __( 'Guest Profile', 'podsyndiconnect' ),
                'add_new_item' => __( 'Add New Guest Profile', 'podsyndiconnect' ),
                'edit_item' => __( 'Edit Guest Profile', 'podsyndiconnect' ),
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array( 'title', 'editor', 'thumbnail', 'revisions' ),
            'menu_icon' => 'dashicons-id-alt',
            'show_in_rest' => true
        ) );

        // Register Host Profile (psc_host)
        register_post_type( 'psc_host', array(
            'labels' => array(
                'name' => __( 'PSC Hosts', 'podsyndiconnect' ),
                'singular_name' => __( 'Host Profile', 'podsyndiconnect' ),
                'add_new_item' => __( 'Add New Host Profile', 'podsyndiconnect' ),
                'edit_item' => __( 'Edit Host Profile', 'podsyndiconnect' ),
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array( 'title', 'editor', 'thumbnail', 'revisions' ),
            'menu_icon' => 'dashicons-microphone',
            'show_in_rest' => true
        ) );
    }

    /**
     * Define default ACF Fields programmatically using acf_add_local_field_group
     */
    public function register_acf_field_groups() {
        if ( ! function_exists( 'acf_add_local_field_group' ) ) {
            return;
        }

        // ACF Fields for Guest Profile (psc_guest)
        acf_add_local_field_group( array(
            'key' => 'group_psc_guest_fields',
            'title' => 'Guest Profile Settings',
            'fields' => array(
                array(
                    'key' => 'field_guest_bio',
                    'label' => 'Biography',
                    'name' => 'bio',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_guest_topics',
                    'label' => 'Speaking Topics',
                    'name' => 'topics',
                    'type' => 'select',
                    'choices' => array(
                        'AI & Future' => 'AI & Future',
                        'Machine Learning' => 'Machine Learning',
                        'Ethics in Tech' => 'Ethics in Tech',
                        'Tech Startups' => 'Tech Startups',
                        'SaaS Growth' => 'SaaS Growth',
                        'Health & Wellness' => 'Health & Wellness',
                        'Arts/Education' => 'Arts/Education',
                    ),
                    'multiple' => 1,
                    'ui' => 1,
                ),
                array(
                    'key' => 'field_guest_industry',
                    'label' => 'Industry sector',
                    'name' => 'industry',
                    'type' => 'select',
                    'choices' => array(
                        'Technology' => 'Technology',
                        'Business/Finance' => 'Business/Finance',
                        'Health & Wellness' => 'Health & Wellness',
                        'Arts/Education' => 'Arts/Education',
                    )
                ),
                array(
                    'key' => 'field_guest_experience',
                    'label' => 'Experience Level',
                    'name' => 'experience_level',
                    'type' => 'radio',
                    'choices' => array(
                        'Beginner' => 'Beginner (0-5 Interviews)',
                        'Intermediate' => 'Intermediate (5-20 Interviews)',
                        'Expert' => 'Expert (20+ Interviews)'
                    )
                ),
                array(
                    'key' => 'field_guest_location',
                    'label' => 'Location',
                    'name' => 'location',
                    'type' => 'text'
                ),
                array(
                    'key' => 'field_guest_remote',
                    'label' => 'Remote/In-Person Preference',
                    'name' => 'remote_preference',
                    'type' => 'select',
                    'choices' => array(
                        'Remote Only' => 'Remote Only',
                        'In-Person Only' => 'In-Person Only',
                        'Hybrid' => 'Hybrid'
                    )
                ),
                array(
                    'key' => 'field_guest_languages',
                    'label' => 'Languages Spoken',
                    'name' => 'languages',
                    'type' => 'checkbox',
                    'choices' => array(
                        'English' => 'English',
                        'Spanish' => 'Spanish',
                        'French' => 'French',
                        'Hindi' => 'Hindi'
                    )
                ),
                array(
                    'key' => 'field_guest_audience',
                    'label' => 'Audience Size Preference',
                    'name' => 'audience_preference',
                    'type' => 'select',
                    'choices' => array(
                        'Niche/Micro' => 'Niche or Micro Communities',
                        'Emerging/Mid' => 'Mid-Sized / Growing Podcasts',
                        'Established/Large' => 'Large Established Audiences'
                    )
                ),
                array(
                    'key' => 'field_guest_formats',
                    'label' => 'Preferred Show Formats',
                    'name' => 'preferred_formats',
                    'type' => 'checkbox',
                    'choices' => array(
                        'Interview' => 'Solo Interview',
                        'Panel/Roundtable' => 'Panel / Conversational Roundtable',
                        'Solo/Co-host' => 'Solo or Co-hosting slots'
                    )
                )
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'psc_guest',
                    ),
                ),
            ),
        ) );

        // ACF Fields for Host Profile (psc_host)
        acf_add_local_field_group( array(
            'key' => 'group_psc_host_fields',
            'title' => 'Host Show Settings',
            'fields' => array(
                array(
                    'key' => 'field_host_description',
                    'label' => 'Show Description',
                    'name' => 'description',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_host_topics',
                    'label' => 'Show Topics Wanted',
                    'name' => 'show_topics',
                    'type' => 'select',
                    'choices' => array(
                        'AI & Future' => 'AI & Future',
                        'Machine Learning' => 'Machine Learning',
                        'Ethics in Tech' => 'Ethics in Tech',
                        'Tech Startups' => 'Tech Startups',
                        'SaaS Growth' => 'SaaS Growth',
                        'Health & Wellness' => 'Health & Wellness',
                        'Arts/Education' => 'Arts/Education',
                    ),
                    'multiple' => 1,
                    'ui' => 1,
                ),
                array(
                    'key' => 'field_host_industry',
                    'label' => 'Show Industry Focus',
                    'name' => 'industry',
                    'type' => 'select',
                    'choices' => array(
                        'Technology' => 'Technology',
                        'Business/Finance' => 'Business/Finance',
                        'Health & Wellness' => 'Health & Wellness',
                        'Arts/Education' => 'Arts/Education',
                    )
                ),
                array(
                    'key' => 'field_host_format',
                    'label' => 'Show Structure Format',
                    'name' => 'format',
                    'type' => 'select',
                    'choices' => array(
                        'Interview' => 'Solo Interview',
                        'Panel/Roundtable' => 'Panel / Conversational Roundtable',
                        'Solo/Co-host' => 'Solo or Co-hosting slots'
                    )
                ),
                array(
                    'key' => 'field_host_audience_size',
                    'label' => 'Current Audience Tier',
                    'name' => 'audience_size',
                    'type' => 'select',
                    'choices' => array(
                        'Niche/Micro' => 'Niche or Micro Communities',
                        'Emerging/Mid' => 'Mid-Sized / Growing Podcasts',
                        'Established/Large' => 'Large Established Audiences'
                    )
                ),
                array(
                    'key' => 'field_host_location',
                    'label' => 'Recording Hub Location',
                    'name' => 'location',
                    'type' => 'text'
                ),
                array(
                    'key' => 'field_host_remote',
                    'label' => 'Guest Remote Options',
                    'name' => 'remote_options',
                    'type' => 'select',
                    'choices' => array(
                        'Remote Only' => 'Remote Recording Only',
                        'In-Person Only' => 'Strictly In-Studio',
                        'Hybrid' => 'Flexible / Hybrid'
                    )
                ),
                array(
                    'key' => 'field_host_languages',
                    'label' => 'Podcast Languages',
                    'name' => 'languages',
                    'type' => 'checkbox',
                    'choices' => array(
                        'English' => 'English',
                        'Spanish' => 'Spanish',
                        'French' => 'French',
                        'Hindi' => 'Hindi'
                    )
                ),
                array(
                    'key' => 'field_host_req_experience',
                    'label' => 'Guest Experience Minimum',
                    'name' => 'required_experience_level',
                    'type' => 'radio',
                    'choices' => array(
                        'Beginner' => 'Beginner Welcomed',
                        'Intermediate' => 'Requires Some Media Experience',
                        'Expert' => 'Expert/High Profile Speakers Only'
                    )
                )
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'psc_host',
                    ),
                ),
            ),
        ) );
    }

    /**
     * Evaluates compatibility engine score (0-100) dynamically
     */
    public function compute_compatibility_score( $guest_id, $host_id ) {
        // Constant dimensions and weights
        $w_reviews = ${weights.reviews || 0};
        $w_topics = ${weights.topics};
        $w_industry = ${weights.industry};
        $w_experience = ${weights.experience};
        $w_format = ${weights.format};
        $w_audience = ${weights.audience};
        $w_location = ${weights.location};
        $w_language = ${weights.language};

        // Assert weights sum to 1.00 roughly
        $w_sum = $w_reviews + $w_topics + $w_industry + $w_experience + $w_format + $w_audience + $w_location + $w_language;
        if ( abs( $w_sum - 1.0 ) > 0.01 ) {
            return array('score' => 0, 'valid' => false, 'reason' => 'Admin mismatch configured weights');
        }

        // Fetch ACF data
        $g_topics = get_field('topics', $guest_id) ?: array();
        $g_industry = get_field('industry', $guest_id);
        $g_experience = get_field('experience_level', $guest_id);
        $g_location = get_field('location', $guest_id);
        $g_remote = get_field('remote_preference', $guest_id);
        $g_languages = get_field('languages', $guest_id) ?: array();
        $g_audience = get_field('audience_preference', $guest_id);
        $g_formats = get_field('preferred_formats', $guest_id) ?: array();

        $h_topics = get_field('show_topics', $host_id) ?: array();
        $h_industry = get_field('industry', $host_id);
        $h_format = get_field('format', $host_id);
        $h_audience = get_field('audience_size', $host_id);
        $h_location = get_field('location', $host_id);
        $h_remote = get_field('remote_options', $host_id);
        $h_languages = get_field('languages', $host_id) ?: array();
        $h_req_experience = get_field('required_experience_level', $host_id);

        // Core score dimensions:
        // 1. Topics Match
        $topics_intersect = array_intersect( $g_topics, $h_topics );
        $topics_score = count($h_topics) > 0 ? count($topics_intersect) / count($h_topics) : 1.0;
        $topics_score = min(1.0, $topics_score);

        // 2. Industry Align
        $industry_score = 0.1;
        if ( strcasecmp($g_industry, $h_industry) === 0 ) {
            $industry_score = 1.0;
        }

        // 3. Experience Match
        $exp_map = array('Beginner' => 1, 'Intermediate' => 2, 'Expert' => 3);
        $g_exp_val = isset($exp_map[$g_experience]) ? $exp_map[$g_experience] : 1;
        $h_exp_val = isset($exp_map[$h_req_experience]) ? $exp_map[$h_req_experience] : 1;
        $experience_score = 0.0;
        if ($g_exp_val >= $h_exp_val) {
            $experience_score = 1.0;
        } elseif ($h_exp_val - $g_exp_val === 1) {
            $experience_score = 0.5;
        } else {
            $experience_score = 0.1;
        }

        // 4. Format Compatibility
        $format_score = 0.3;
        if ( in_array( $h_format, $g_formats ) ) {
            $format_score = 1.0;
        } elseif ( empty($g_formats) ) {
            $format_score = 0.9;
        }

        // 5. Audience Fit
        $audience_score = 0.2;
        if ( $g_audience === $h_audience ) {
            $audience_score = 1.0;
        } else {
            $g_aud_val = isset($exp_map[str_replace('Niche/', 'Beginner', str_replace('Emerging/', 'Intermediate', str_replace('Established/', 'Expert', $g_audience)))]) ? 2 : 1;
            // simplified offset checking
            $audience_score = 0.6;
        }

        // 6. Location Harmony
        $location_score = 0.3;
        $clean_g_loc = strtolower($g_location);
        $clean_h_loc = strtolower($h_location);
        if ($g_remote === 'Remote Only' && $h_remote === 'Remote Only') {
            $location_score = 1.0;
        } elseif (strpos($clean_g_loc, $clean_h_loc) !== false || strpos($clean_h_loc, $clean_g_loc) !== false) {
            $location_score = 1.0;
        } elseif ($g_remote === 'Hybrid' && $h_remote === 'Hybrid') {
            $location_score = 0.7;
        }

        // 7. Language Support
        $language_intersect = array_intersect( $h_languages, $g_languages );
        $language_score = 0.0;
        if ( count($language_intersect) === count($h_languages) ) {
            $language_score = 1.0;
        } elseif ( count($language_intersect) > 0 ) {
            $language_score = 0.55;
        }

        // 8. Reviews Score
        $g_review = get_field('review_rating', $guest_id);
        $h_review = get_field('review_rating', $host_id);
        
        $reviews_score = 0.5;
        if ($g_review !== false && $h_review !== false) {
            $reviews_score = max(0, (($g_review + $h_review) / 2) / 5.0);
        } elseif ($g_review !== false) {
            $reviews_score = max(0, $g_review / 5.0);
        } elseif ($h_review !== false) {
            $reviews_score = max(0, $h_review / 5.0);
        }

        // Weighted final score
        $raw_score = 
            ($w_reviews * $reviews_score) +
            ($w_topics * $topics_score) +
            ($w_industry * $industry_score) +
            ($w_experience * $experience_score) +
            ($w_format * $format_score) +
            ($w_audience * $audience_score) +
            ($w_location * $location_score) +
            ($w_language * $language_score);

        return array(
            'score' => round($raw_score * 100),
            'valid' => true,
            'trace' => array(
                'topics' => $topics_score,
                'industry' => $industry_score,
                'experience' => $experience_score,
                'format' => $format_score,
                'audience' => $audience_score,
                'location' => $location_score,
                'language' => $language_score
            )
        );
    }

    /**
     * Renders [psc_match_score_badge_dynamic] Shortcode
     */
    public function render_badge_shortcode( $atts ) {
        // Identify profile context
        $current_post_id = get_the_ID();
        if ( ! $current_post_id ) {
            return $this->get_locked_badge_html( 'No active profile found.' );
        }

        $post_type = get_post_type( $current_post_id );
        if ( ! in_array( $post_type, array( 'psc_guest', 'psc_host' ) ) ) {
            return ''; // Hide entirely on general blogs
        }

        // Resolve current logged-in user's psc mapped profile
        $current_user_id = get_current_user_id();
        if ( ! $current_user_id ) {
            return $this->get_locked_badge_html( 'Unlock compatibility. Log in to view.' );
        }

        // Map WordPress User to Guest or Host profile post
        // Real-world site: mapping done via standard database query or user_meta.
        $viewer_profile_id = get_user_meta( $current_user_id, 'psc_profile_id', true );
        if ( ! $viewer_profile_id ) {
            // Find post where author matches logged-in user
            $active_posts = get_posts( array(
                'post_type' => ($post_type === 'psc_guest') ? 'psc_host' : 'psc_guest',
                'author' => $current_user_id,
                'posts_per_page' => 1
            ) );
            if ( ! empty($active_posts) ) {
                $viewer_profile_id = $active_posts[0]->ID;
            }
        }

        if ( ! $viewer_profile_id ) {
            return $this->get_locked_badge_html( 'Please configure your Host or Guest Profile to view matchmaking fits.' );
        }

        $viewer_post_type = get_post_type( $viewer_profile_id );
        if ( $viewer_post_type === $post_type ) {
            // Can't match Guest viewing Guest or Host viewing Host in normal flows
            return '';
        }

        // Calculate matchmaking score
        $guest_id = ( $post_type === 'psc_guest' ) ? $current_post_id : $viewer_profile_id;
        $host_id = ( $post_type === 'psc_host' ) ? $current_post_id : $viewer_profile_id;

        $results = $this->compute_compatibility_score( $guest_id, $host_id );

        if ( ! $results['valid'] ) {
            return $this->get_locked_badge_html( 'Scores calculation issue: ' . $results['reason'] );
        }

        $score = $results['score'];
        return $this->get_gold_shield_badge_html( $score );
    }

    /**
     * Enqueue CSS styling for the Gold Shield
     */
    public function enqueue_styles() {
        wp_register_style( 'psc-global-badge', false );
        wp_enqueue_style( 'psc-global-badge' );
        
        $custom_css = "
        .psc-gold-shield-container {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px;
            text-align: center;
            font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        .psc-gold-shield {
            width: 110px;
            height: 120px;
            filter: drop-shadow(0px 8px 16px rgba(184, 134, 11, 0.25));
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }
        .psc-gold-shield:hover {
            transform: scale(1.05);
        }
        .psc-gold-shield-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        .psc-shield-overlay {
            position: relative;
            z-index: 2;
            text-align: center;
            margin-top: -6px;
        }
        .psc-shield-score {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.6);
            line-height: 1;
        }
        .psc-shield-lbl {
            font-size: 9px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.8px;
            color: rgba(255,255,255,0.9);
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            margin-top: 2px;
        }
        .psc-shield-label {
            margin-top: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #8a6d1c;
        }
        .psc-locked-shield {
            border: 2px dashed #d1b87a;
            background: rgba(250, 246, 230, 0.8);
            border-radius: 8px;
            padding: 12px 18px;
            color: #7a632b;
            font-size: 11px;
            font-weight: 600;
            max-width: 200px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }
        ";
        wp_add_inline_style( 'psc-global-badge', $custom_css );
    }

    private function get_gold_shield_badge_html( $score ) {
        return '
        <div class="psc-gold-shield-container">
            <div class="psc-gold-shield">
                <svg class="psc-gold-shield-svg" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="pscGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#FFDF73" />
                            <stop offset="50%" stop-color="#D4AF37" />
                            <stop offset="100%" stop-color="#AA7C11" />
                        </linearGradient>
                    </defs>
                    <path d="M50 5 L90 25 C90 65 75 90 50 105 C25 90 10 65 10 25 L50 5 Z" fill="url(#pscGoldGradient)" stroke="#8A6D1C" stroke-width="4" stroke-linejoin="round"/>
                    <path d="M50 10 L83 28 C83 62 70 85 50 98 C30 85 17 62 17 28 L50 10 Z" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2"/>
                </svg>
                <div class="psc-shield-overlay">
                    <div class="psc-shield-score">' . intval($score) . '%</div>
                    <div class="psc-shield-lbl">Match</div>
                </div>
            </div>
            <div class="psc-shield-label">PodSyndiConnect Fit</div>
        </div>
        ';
    }

    private function get_locked_badge_html( $message ) {
        return '
        <div class="psc-gold-shield-container">
            <div class="psc-locked-shield">
                <span class="dashicons dashicons-lock" style="margin-right: 4px;font-size: 15px;width:15px;height:15px;"></span>
                ' . esc_html( $message ) . '
            </div>
        </div>
        ';
    }

    /**
     * Renders [psc_interactive_simulator] Shortcode for embedding this entire interactive React matching simulator applet
     */
    public function render_interactive_simulator_shortcode( $atts ) {
        $atts = shortcode_atts( array(
            'src' => 'https://ais-pre-uog5a2u54ybho7azavw4wk-580353222092.us-west2.run.app',
            'height' => '720px',
        ), $atts, 'psc_interactive_simulator' );

        return '
        <div class="psc-app-embed-wrapper" style="width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.04); background: #ffffff; padding: 0; margin: 20px 0;">
            <iframe src="' . esc_url( $atts['src'] ) . '" style="width: 100%; height: ' . esc_attr( $atts['height'] ) . '; border: none; display: block;" allow="camera; microphone; geolocation" referrerpolicy="no-referrer"></iframe>
        </div>
        ';
    }
}

// Instantiate Singleton
add_action( 'plugins_loaded', array( 'PodSyndiConnect_Plugin', 'get_instance' ) );
`;
}

