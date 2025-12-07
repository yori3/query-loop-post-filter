<?php
/**
 * Plugin Name: Query Loop Post Filter
 * Description: クエリーループブロックに投稿タイトルで絞り込む機能を追加
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: query-loop-post-filter
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Query_Loop_Post_Filter {
    
    public function __construct() {
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
        add_filter( 'query_loop_block_query_vars', array( $this, 'modify_query_vars' ), 10, 2 );
    }
    
    public function enqueue_editor_assets() {
        $asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
        
        wp_enqueue_script(
            'query-loop-post-filter',
            plugins_url( 'build/index.js', __FILE__ ),
            $asset_file['dependencies'],
            $asset_file['version'],
            true
        );
        
        if ( file_exists( plugin_dir_path( __FILE__ ) . 'build/index.css' ) ) {
            wp_enqueue_style(
                'query-loop-post-filter',
                plugins_url( 'build/index.css', __FILE__ ),
                array(),
                $asset_file['version']
            );
        }
    }
    
    public function modify_query_vars( $query, $block ) {
        // query.include 属性をチェック
        if ( isset( $block->context['query']['include'] ) && ! empty( $block->context['query']['include'] ) ) {
            $include = $block->context['query']['include'];
            
            if ( is_array( $include ) ) {
                $post_ids = array_map( 'intval', $include );
                $post_ids = array_filter( $post_ids );
                
                if ( ! empty( $post_ids ) ) {
                    $query['post__in'] = $post_ids;
                    $query['orderby'] = 'post__in';
                }
            }
        }
        
        return $query;
    }
}

new Query_Loop_Post_Filter();