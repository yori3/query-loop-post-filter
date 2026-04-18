<?php
/**
 * Plugin Name: Query Loop Post Filter
 * Description: クエリーループブロックに投稿タイトルで絞り込む機能を追加
 * Version: 1.1.0
 * Requires at least: 6.7
 * Requires PHP: 8.0
 * Text Domain: query-loop-post-filter
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Query_Loop_Post_Filter {
    
    public function __construct() {
        add_action( 'init', array( $this, 'register_block' ) );
        add_filter( 'query_loop_block_query_vars', array( $this, 'modify_query_vars' ), 10, 2 );
    }

    public function register_block() {
        register_block_type( __DIR__ . '/build' );
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