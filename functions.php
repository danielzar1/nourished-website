<?php
if ( ! defined( 'ABSPATH' ) ) exit;

define( 'NOURISHED_VERSION', '1.0.0' );
define( 'NOURISHED_DIR', get_template_directory() );
define( 'NOURISHED_URI', get_template_directory_uri() );

function nourished_setup() {
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    register_nav_menus( array(
        'primary' => esc_html__( 'Primary Menu', 'nourished' ),
        'footer'  => esc_html__( 'Footer Menu', 'nourished' ),
    ) );
}
add_action( 'after_setup_theme', 'nourished_setup' );

function nourished_enqueue_assets() {
    wp_enqueue_style( 'nourished-style', get_stylesheet_uri(), array(), NOURISHED_VERSION );
    wp_enqueue_style( 'nourished-fonts', 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700;800&display=swap', array(), null );
    
    wp_enqueue_script( 'gsap', NOURISHED_URI . '/assets/vendor/gsap.min.js', array(), NOURISHED_VERSION, true );
    wp_enqueue_script( 'gsap-scroll-trigger', NOURISHED_URI . '/assets/vendor/ScrollTrigger.min.js', array( 'gsap' ), NOURISHED_VERSION, true );
    wp_enqueue_script( 'canvas-confetti', NOURISHED_URI . '/assets/vendor/confetti.min.js', array(), NOURISHED_VERSION, true );
    
    wp_enqueue_script( 'nourished-products', NOURISHED_URI . '/assets/js/products.js', array(), NOURISHED_VERSION, true );
    wp_enqueue_script( 'nourished-fx', NOURISHED_URI . '/assets/js/fx.js', array(), NOURISHED_VERSION, true );
    wp_enqueue_script( 'nourished-cart', NOURISHED_URI . '/assets/js/cart.js', array(), NOURISHED_VERSION, true );
    wp_enqueue_script( 'nourished-components', NOURISHED_URI . '/assets/js/components.js', array(), NOURISHED_VERSION, true );
    wp_enqueue_script( 'nourished-shop', NOURISHED_URI . '/assets/js/shop.js', array(), NOURISHED_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'nourished_enqueue_assets' );

function nourished_widgets_init() {
    register_sidebar( array(
        'name'          => esc_html__( 'Primary Sidebar', 'nourished' ),
        'id'            => 'primary-sidebar',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );
}
add_action( 'widgets_init', 'nourished_widgets_init' );

if ( ! current_user_can( 'manage_options' ) ) {
    add_filter( 'show_admin_bar', '__return_false' );
}
